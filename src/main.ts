import "../node_modules/modern-normalize/modern-normalize.css";
import "./style.css";

import fileInputSetup from "./components/fileInputSetup";
import optionsSetup from "./components/optionsSetup";

import { startGame } from "./components/moduleSetup";

export const errorP = document.getElementById("error") as HTMLParagraphElement;

let gameArguments: string[] = [];

const argumentsInput = document.getElementById(
	"argumentsInput"
) as HTMLInputElement;
argumentsInput.addEventListener(
	"change",
	() => (gameArguments = argumentsInput.value.split(" "))
);

const startButton = document.getElementById("start") as HTMLButtonElement;
startButton.addEventListener("click", () => startGame(gameArguments));

fileInputSetup();
optionsSetup();

interface NavigatorExt extends Navigator {
	keyboard: {
		lock: () => Promise<void>;
		unlock: () => Promise<void>;
	};
}

const navigator = window.navigator as NavigatorExt;

// Only works in Chrome :(
if (navigator.keyboard)
	addEventListener("fullscreenchange", () => {
		if (document.fullscreenElement) navigator.keyboard.lock();
		else navigator.keyboard.unlock();
	});
