--- f-string.lua - an implementation of Python-style f-strings in Lua
-- @author [Ezhik](https://ezhik.jp)
-- @module f-string
-- @license MPL-2.0

local function getEnvWithLocals(level)
    if level == nil then level = 2 end

    return setmetatable({}, {
        __index = function(_, k)
            local v = nil

            -- first, check locals
            for i = 1, math.maxinteger do
                local lk, lv = debug.getlocal(level, i)
                if lk == nil then
                    break
                end
                if lk == k then
                    v = lv
                end
            end
            if v ~= nil then
                return v
            end

            -- upvalues
            -- BUG: this only works if you access the upvalue outside of the f-string
            local f = debug.getinfo(level, "f").func
            for i = 1, math.maxinteger do
                local uk, uv = debug.getupvalue(f, i)

                if uk == nil then
                    break
                end
                if uk == k then
                    return uv
                end
            end

            -- globals
            return _G[k]
        end,
        __newindex = function(_, k, v)
            -- locals
            local lIdx = nil
            for i = 1, math.maxinteger do
                local lk, lv = debug.getlocal(level, i)
                if lk == nil then
                    break
                end
                if lk == k then
                    lIdx = i
                end
            end

            if lIdx ~= nil then
                debug.setlocal(level, lIdx, v)
                return
            end

            -- upvalues
            -- BUG: this only works if you access the upvalue outside of the f-string
            local uIdx = nil
            local f = debug.getinfo(level, "f").func
            for i = 1, math.maxinteger do
                local uk, uv = debug.getupvalue(f, i)

                if uk == nil then
                    break
                end
                if uk == k then
                    uIdx = i
                    break
                end
            end
            if uIdx ~= nil then
                debug.setupvalue(f, uIdx, v)
                return
            end

            -- globals
            _G[k] = v
        end,
    })
end


local function f(input)
    local env = getEnvWithLocals(5)

    local function at(i)
        if i > #input then
            return nil
        end

        return input:sub(i, i)
    end

    local idx = 1

    local function err(msg)
        error(string.format("f-string: %s at position %s", msg, idx))
    end

    local function next(i)
        return at(idx + (i or 0))
    end

    local function takeNext(n)
        if n == nil then
            n = 1
        end

        local s = input:sub(idx, idx + n - 1)
        idx = idx + n
        return s
    end

    local function is(c)
        return input:sub(idx, idx + #c - 1) == c
    end
    local function expect(c)
        if not is(c) then
            err(string.format("Expected '%s'", c))
        end
    end
    local function take(c)
        expect(c)
        return takeNext(#c)
    end


    local function parseQuotedString()
        local parts = {}
        local function add(str) table.insert(parts, str) end

        if not is('"') and not is("'") then
            err("Expected '\"' or '''")
        end

        local quote = takeNext(1)
        add(quote)

        while next() do
            if is(quote) then
                add(takeNext(1))
                return table.concat(parts)
            elseif is("\\") then
                add(takeNext(2))
            else
                add(takeNext())
            end
        end

        err("Expected '" .. quote .. "'")
    end


    local function parseMultilineString()
        local parts = {}
        local function add(str) table.insert(parts, str) end

        add(take("["))

        local close = "]"
        while next() == "=" do
            add(takeNext(1))
            close = close .. "="
        end
        close = close .. "]"

        add(take("["))

        while next() do
            if is(close) then
                add(takeNext(#close))
                return table.concat(parts)
            else
                add(takeNext())
            end
        end
        err("Expected '" .. close .. "'")
    end

    local function parseSingleLineComment()
        local parts = {}
        local function add(str) table.insert(parts, str) end

        add(take("--"))

        while next() do
            if is("\n") then
                add(takeNext(1))
                return table.concat(parts)
            else
                add(takeNext())
            end
        end

        return table.concat(parts)
    end
    local function parseMultiLineComment()
        local parts = {}
        local function add(str) table.insert(parts, str) end

        add(take("--[["))
        while next() do
            if is("]]") then
                add(takeNext(2))
                return table.concat(parts)
            else
                add(takeNext())
            end
        end

        err("Expected ']]'")
    end

    local function parseBraces(topLevel)
        local parts = {}
        local function add(str) table.insert(parts, str) end

        add(take("{"))

        local spec
        while next() do
            --    braces
            if is("}") then
                add(takeNext(1))
                local result = table.concat(parts)

                local eqMatch
                if topLevel then
                    eqMatch = result:match("%s*=%s*}$")
                    if eqMatch then
                        eqMatch = eqMatch:sub(1, #eqMatch - 1)
                        result = result:sub(1, #result - #eqMatch - 1) .. "}"
                    end
                end

                return result, eqMatch, spec
            elseif is("{") then
                add(parseBraces())

                -- comments
            elseif is("--[[") then
                add(parseMultiLineComment())
            elseif is("--") then
                add(parseSingleLineComment())

                -- strings
            elseif is('"') or is("'") then
                add(parseQuotedString())
            elseif is("[[") or is("[=") then
                add(parseMultilineString())

                -- etc
            elseif topLevel and is(":%") then
                takeNext(1)
                spec = ""
                while not is("}") do
                    spec = spec .. takeNext(1)
                end
            else
                add(takeNext())
            end
        end

        error("Expected '}'")
    end

    local function parseExpr()
        local expr, eqMatch, spec = parseBraces(true)
        expr = expr:sub(2, #expr - 1)
        local result = load("return " .. expr, expr, "t", env)()

        spec = spec or "%s"
        result = string.format(spec, result)

        if eqMatch then
            return string.format("%s%s%s", expr, eqMatch, result)
        else
            return result
        end
    end

    local function parseString()
        local parts = {}
        local function add(str) table.insert(parts, str) end

        while next() do
            --     curly left
            if is"{{" then
                takeNext(2)
                add("{")
            elseif is("{}") then
                error("valid expression required before '}'")
            elseif is("{") then
                add(parseExpr())

                -- curly right
            elseif is("}}") then
                takeNext(2)
                add("}")
            elseif is("}") then
                error("single '}' is not allowed")

                -- the rest is just text
            else
                add(takeNext(1))
            end
        end

        return table.concat(parts)
    end


    return parseString()
end

return f
