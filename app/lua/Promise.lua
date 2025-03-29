--- Promise.lua - an implementation of JavaScript-style promises in Lua
-- @author [Ezhik](https://ezhik.jp)
-- @module Promise
-- @license MPL-2.0

-- #region Core implementation
---@class Promise
---@field private _internal PromiseInternal
local Promise = {}
Promise.__index = Promise
Promise.__name = "Promise"

---@alias PromiseState
---| 0 # PENDING
---| 1 # FULFILLED
---| 2 # REJECTED
local PENDING = 0
local FULFILLED = 1
local REJECTED = 2

---@type table<PromiseState, string>
local stateNames = {
    [PENDING] = "pending",
    [FULFILLED] = "fulfilled",
    [REJECTED] = "rejected",
}

function Promise:__tostring()
    local x = self._internal
    return string.format("Promise {<%s>}", stateNames[x.state])
end

---Function which is used to schedule the execution of a callback asynchronously (hopefully)
---Override this to use a different scheduler
---@param fn function The function to be scheduled
---@return nil
function Promise.schedule(fn)
    pcall(fn)
end

---Check if the given value is callable
---@param fn any
---@return boolean
local function isCallable(fn)
    if type(fn) == "function" then
        return true
    elseif type(fn) == "table" then
        local mt = getmetatable(fn)
        return mt and mt.__call
    end
    return false
end

---@class PromiseInternal
---@field value any
---@field state PromiseState
---@field onFulfilled table<function>
---@field onRejected table<function>
---@field traceback string

---Creates a new Promise
---@param fn fun(resolve: fun(any), reject: fun(any)) Function which will resolve or reject this promise
---@return Promise
function Promise.new(fn)
    local self = setmetatable({
        _internal = {
            value = nil,
            state = PENDING,
            onFulfilled = {},
            onRejected = {},
            traceback = debug.traceback(),
        },
    }, Promise)
    local x = self._internal

    local function triggerPromiseReactions(reactions, argument)
        for _, reaction in ipairs(reactions) do
            local job = function() reaction(argument) end
            Promise.schedule(job)
        end
    end

    local function fulfillPromise(value)
        local reactions = x.onFulfilled
        x.onFulfilled = nil
        x.state = FULFILLED
        x.value = value
        triggerPromiseReactions(reactions, value)
    end

    local function rejectPromise(reason)
        local reactions = x.onRejected
        x.onRejected = nil
        x.state = REJECTED
        x.value = reason
        triggerPromiseReactions(reactions, reason)
    end

    local pcallOrReject = function(fn, ...)
        local ok, err = pcall(fn, ...)
        if not ok then
            rejectPromise(err)
        end
    end

    local resolve, reject
    resolve = function(resolution)
        if x.state ~= PENDING then
            return
        end

        if resolution == self then
            rejectPromise("TypeError: Promise resolved with itself")
            return
        end

        if type(resolution) ~= "table" then
            fulfillPromise(resolution)
            return
        end

        local ok, next = pcall(function() return resolution.next end)
        if not ok then
            rejectPromise(next)
            return
        end

        if not isCallable(next) then
            fulfillPromise(resolution)
            return
        end

        pcallOrReject(next, resolution, resolve, reject)
    end

    reject = function(reason)
        if x.state ~= PENDING then
            return
        end
        rejectPromise(reason)
    end

    pcallOrReject(fn, resolve, reject)

    return self
end

---@alias PromiseCallback fun(any): any

---Registers callbacks for the resolution or rejection of the promise
---@param onFulfilled? PromiseCallback
---@param onRejected? PromiseCallback
---@return Promise
function Promise:next(onFulfilled, onRejected)
    local x = self._internal
    return Promise.new(function(resolve, reject)
        if x.state == FULFILLED then
            if onFulfilled and isCallable(onFulfilled) then
                resolve(onFulfilled(x.value))
            else
                resolve(x.value)
            end
        elseif x.state == REJECTED then
            if onRejected and isCallable(onRejected) then
                resolve(onRejected(x.value))
            else
                reject(x.value)
            end
        else
            if onFulfilled and isCallable(onFulfilled) then
                table.insert(x.onFulfilled, function(value) resolve(onFulfilled(value)) end)
            else
                table.insert(x.onFulfilled, function(value) resolve(value) end)
            end

            if onRejected then
                table.insert(x.onRejected, function(reason)
                    resolve(onRejected(reason))
                end)
            end
        end
    end)
end

-- #endregion


-- #region Promise shortcuts

---Registers a callback only for the rejection of a promise
---@param onRejected? PromiseCallback
---@return Promise
function Promise:catch(onRejected)
    return self:next(nil, onRejected)
end

---Registers a callback that will be called when the promise is settled
---The resolved value cannot be modified from the callback
---@param onFinally? fun(): any
---@return Promise
function Promise:finally(onFinally)
    return self:next(
        function(value)
            if onFinally and isCallable(onFinally) then
                pcall(onFinally)
            end
            return value
        end,
        function(reason)
            if onFinally and isCallable(onFinally) then
                pcall(onFinally)
            end
            return reason
        end
    )
end

---Creates a promise resolved with the given value
---@param value any
---@return Promise
function Promise.resolve(value)
    return Promise.new(function(resolve)
        resolve(value)
    end)
end

---Creates a promise rejected with the given reason
---@param reason any
---@return Promise
function Promise.reject(reason)
    return Promise.new(function(_, reject)
        reject(reason)
    end)
end

---Creates a new promise and returns it along with its resolve and reject functions
---@return Promise
---@return fun(any)
---@return fun(any)
function Promise.withResolvers()
    local resolve, reject
    local promise = Promise.new(function(resolve_, reject_)
        resolve = resolve_
        reject = reject_
    end)

    return promise, resolve, reject
end

---Takes a callback and wraps its result in a promise
---@param fn fun(...): any A callback
---@param ... unknown Arguments to pass to the callback
---@return Promise
function Promise.try(fn, ...)
    local args = { ... }
    return Promise.new(function(resolve, reject)
        local ok, result = pcall(fn, table.unpack(args))
        if ok then
            resolve(result)
        else
            reject(result)
        end
    end)
end

-- #endregion


-- #region Promise combinators

---Returns a promise that is resolved with an array of results when all of the provided promises resolve
---or rejected when any promise is rejected
---@param promises Promise[]
---@return Promise
function Promise.all(promises)
    return Promise.new(function(resolve, reject)
        local results = {}
        local remaining = #promises

        if remaining == 0 then
            resolve(results)
            return
        end

        for i, promise in ipairs(promises) do
            promise:next(function(value)
                results[i] = value
                remaining = remaining - 1
                if remaining == 0 then
                    resolve(results)
                end
            end):catch(reject)
        end
    end)
end

---Returns a promise that is resolved or rejected when any of the provided promises resolve or reject
---@param promises Promise[]
---@return Promise
function Promise.race(promises)
    return Promise.new(function(resolve, reject)
        for _, promise in ipairs(promises) do
            promise:next(resolve, reject)
        end
    end)
end

---Returns a promise that is resolved when any of the provided promises resolve or rejected when all of the provided promises reject
---@param promises Promise[]
---@return Promise
function Promise.any(promises)
    return Promise.new(function(resolve, reject)
        local errors = {}
        local remaining = #promises

        if remaining == 0 then
            reject({ "No promises were resolved" })
            return
        end

        for i, promise in ipairs(promises) do
            promise:next(resolve, function(reason)
                errors[i] = reason
                remaining = remaining - 1
                if remaining == 0 then
                    reject(errors)
                end
            end)
        end
    end)
end

---Returns a promise that is resolved with an array of results when all of the provided promises resolve or reject
---@param promises Promise[]
---@return Promise
function Promise.allSettled(promises)
    return Promise.new(function(resolve)
        local results = {}
        local remaining = #promises

        if remaining == 0 then
            resolve(results)
            return
        end

        for i, promise in ipairs(promises) do
            promise:next(
                function(value) results[i] = { status = "fulfilled", value = value } end,
                function(reason) results[i] = { status = "rejected", reason = reason } end
            ):finally(function()
                remaining = remaining - 1
                if remaining == 0 then
                    resolve(results)
                end
            end)
        end
    end)
end

-- #endregion

-- #region Extensions

-- #region Rust-ish
---Returns a promise that will cast rejections to nil
---@return Promise
function Promise:ok()
    return self:next(nil, function() end)
end

-- #endregion

-- #region For debugging
---Will print the resolution result to the console when the promise is resolved
---@return Promise
function Promise:print()
    return self:next(
        function(value)
            print("Fulfilled:", value)
            return value
        end,
        function(reason)
            print("Rejected:", reason)
            return reason
        end
    )
end

-- #endregion

-- #region async-await
---If executed from a coroutine, will yield until the promise is resolved and return the resolved value
---@return any
function Promise:await()
    if not coroutine.isyieldable() then
        error("Promise:await() must be called from a yieldable coroutine")
    end

    local x = self._internal

    if x.state == PENDING then
        local co = coroutine.running()
        self:finally(function()
            coroutine.resume(co)
        end)
        coroutine.yield()
    end

    if x.state == FULFILLED then
        return x.value
    elseif x.state == REJECTED then
        error(x.value)
    else
        Promise.thisIsNeverSupposedToHappen = self
        error("Promise is in an invalid state")
        print("Promise is in an invalid state, check Promise.thisIsNeverSupposedToHappen")
    end
end

---Wraps potentially asynchronous functions to make them return a promise
---@param fn fun(...): any A function to wrap
---@return fun(...): Promise A wrapped function
function Promise.async(fn)
    return function(...)
        local args = { ... }
        return Promise.new(function(resolve, reject)
            local co = coroutine.create(function()
                local ok, result = pcall(fn, table.unpack(args))
                if ok then
                    resolve(result)
                else
                    reject(result)
                end
            end)
            Promise.schedule(function()
                coroutine.resume(co)
            end)
        end)
    end
end

-- #endregion

-- #endregion

return Promise
