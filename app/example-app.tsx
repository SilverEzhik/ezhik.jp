import { useState } from "react";
import { makeInit } from "./lib/init";

const phrases = [
	"It's your typical React hello world type of app.",
	"🦔🦔🦔🦔🦔🦔🦔🦔🦔🦔🦔🦔",
	"You ever miss Flash Player?",
	"I want to make neat things.",
	"Vite is weird.",
	"🦔🦔🦔",
	"🦔",
	"and you don't seem to understand",
	"a shame you seemed an honest man",
	"and all the fears you hold so dear",
	"will turn to whisper in your ear",
	"ハリネズミは世界一",
	"ハリネズミ",
	"Hedgehog",
	"Ëжик",
	"Їжачок",
	"Ezhik",
	"In Ichikawa Zoo there are two very cute fennecs, Inari and Kontaro",
	"🦊🦊",
	"We could've had it all but instead we get this",
	"Y2K ended too soon",
	"You know, I don't even like web apps.",
	"But they're kind of the only free platform out there.",
	"You wouldn't put a toy like this on the App Store.",
	"But the web is fair game.",
	"I hope I can make some nicer CSS for this.",
	"meow meow meow meow",
];

function App() {
	// just a little test thing...
	const [count, setCount] = useState(0);
	const [phrase, setPhrase] = useState(phrases[0]);
	return (
		<div>
			<h1>{phrase}</h1>
			<button
				style={{ transform: `scale(${1 + count * 0.01})` }}
				onClick={() => {
					if (count > 20) {
						const hog = document.createElement("img");
						hog.className = "hog";
						hog.src = "/icons/hog.svg";
						hog.style.position = "absolute";
						hog.style.left = `${Math.random() * 100}vw`;
						hog.style.top = `${Math.random() * 100}vh`;
						const s = Math.random() * 100;
						hog.style.width = `${s}px`;
						hog.style.height = `${s}px`;
						hog.style.pointerEvents = "none";

						document.body.appendChild(hog);

						if (Math.random() > 0.9) {
							setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
						}
					}
					setCount(count + 1);
				}}
			>
				count is: {count}
			</button>
		</div>
	);
}

export default makeInit(App);
