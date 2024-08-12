import { fileLocalInputSetup } from "./components/fileInput";
import optionsSetup from "./components/options";
import { startGame } from "./components/gameModule";
import { NavigatorExt } from "./types";

export const startButton = document.getElementById(
	"startButton"
) as HTMLButtonElement;
startButton.addEventListener("click", () => startGame());

export const statusP = document.getElementById(
	"status"
) as HTMLParagraphElement;

const navigator = window.navigator as NavigatorExt;

// Disable browser hotkeys in fullscreen mode - only works in Chrome :(
if (navigator.keyboard)
	addEventListener("fullscreenchange", () => {
		if (document.fullscreenElement) navigator.keyboard.lock();
		else navigator.keyboard.unlock();
	});

document.addEventListener("DOMContentLoaded", () => {
	fileLocalInputSetup();
	optionsSetup();
});
