import createModule from "../static/ecwolf";
import { startButton, statusP } from "../main";
import errorHandler from "./errorHandler";
import { EmscriptenModuleExt } from "../types";
import { fileListSelect, fileRemoteInputSetup } from "./fileInput";
import { NavigatorExt } from "../types";

let gameModule: EmscriptenModuleExt | null = null;

const argumentsInput = document.getElementById(
	"argumentsInput"
) as HTMLInputElement;

const showGame = () => {
	document.getElementById("setup")!.style.display = "none";
	document.getElementById("canvas")!.style.display = "block";
	document.body.style.backgroundColor = "black";
};

const exitGameHandler = () => {
	document.getElementById("setup")!.style.display = "flex";
	document.getElementById("canvas")!.style.display = "none";
	document.body.style.backgroundColor = "initial";
	gameModule = null;
};

export const startGame = async () => {
	startButton.disabled = true;
	statusP.textContent = "Loading...";

	fetch("/static/ecwolf.pk3", {
		method: "HEAD"
	}).catch((e) => {
		errorHandler(e as string);
		return;
	});

	gameModule = (await createModule({
		locateFile: () => "/static/ecwolf.wasm",
		canvas: document.getElementById("canvas") as HTMLCanvasElement
	}).catch((e) => {
		errorHandler(e as string);
		return;
	})) as EmscriptenModuleExt;
	const { FS } = gameModule;

	fetch("/static/ecwolf.pk3", {
		method: "HEAD"
	}).catch((e: unknown) => {
		errorHandler(e as string);
		return;
	});

	const runDependencies: Promise<void>[] = [];

	// Preload ecwolf.pk3 - necessary
	runDependencies.push(
		new Promise<void>((resolve) => {
			FS.createPreloadedFile(
				"/",
				"ecwolf.pk3",
				"/static/ecwolf.pk3",
				true,
				false,
				() => resolve()
			);
		})
	);

	await fileRemoteInputSetup();

	const fileList = fileListSelect();
	if (!fileList?.length) {
		errorHandler("No files selected");
		return;
	}

	for (const file of fileList) {
		runDependencies.push(
			new Promise<void>((resolve) =>
				FS.createPreloadedFile("/", file.name, file.data, true, false, () =>
					resolve()
				)
			)
		);
	}

	await Promise.all(runDependencies);

	gameModule["onExit"] = () => exitGameHandler();

	statusP.textContent = "";

	try {
		gameModule.callMain(argumentsInput.value.split(" "));
		showGame();
	} catch (e) {
		errorHandler(e as string);
		return;
	}

	startButton.disabled = false;
};

const navigator = window.navigator as NavigatorExt;
addEventListener("fullscreenchange", () => {
	if (!gameModule) return;

	gameModule.ccall(
		"SetFullscreenEmscripten",
		"void",
		["bool"],
		[!!document.fullscreenElement]
	);

	// Disable browser hotkeys in fullscreen mode - doesn't work in Firefox yet
	if (navigator.keyboard) {
		if (document.fullscreenElement) navigator.keyboard.lock();
		else navigator.keyboard.unlock();
	}
});

addEventListener("error", (e) => {
	exitGameHandler();
	errorHandler(e.error as string);
});
