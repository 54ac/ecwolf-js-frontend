import { fileLocalInputSetup } from "./components/fileInput";
import optionsSetup from "./components/options";
import { startGame } from "./components/gameModule";

export const startButton = document.getElementById(
	"startButton"
) as HTMLButtonElement;
startButton.addEventListener("click", () => startGame());

export const statusP = document.getElementById(
	"status"
) as HTMLParagraphElement;

document.addEventListener("DOMContentLoaded", () => {
	fileLocalInputSetup();
	optionsSetup();
});
