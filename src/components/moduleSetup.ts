import createModule from "../static/ecwolf";

import { fileList, fileURLHandler } from "./fileInputSetup";

interface EmscriptenModuleExt extends EmscriptenModule {
	FS_createPreloadedFile: typeof FS.createPreloadedFile;
	canvas: HTMLCanvasElement;
	arguments_: string[];
	// eslint-disable-next-line no-unused-vars
	callMain: (args: string[]) => void;
}

export let gameModule: EmscriptenModuleExt;

export const startGame = async (gameArguments: string[]) => {
	gameModule = await createModule({
		locateFile: () => "/static/ecwolf.wasm"
	});

	gameModule["canvas"] = document.getElementById("canvas") as HTMLCanvasElement;

	const preloadPk3 = new Promise<void>((resolve) =>
		gameModule.FS_createPreloadedFile(
			"/",
			"ecwolf.pk3",
			"/static/ecwolf.pk3",
			true,
			false,
			() => resolve()
		)
	);

	// Set up fetch-related inputs here, local files in fileInputSetup
	const fileDefault = document.getElementById(
		"fileDefault"
	) as HTMLInputElement;

	const fileURL = document.getElementById("fileURL") as HTMLInputElement;
	const fileURLInput = document.getElementById(
		"fileURLInput"
	) as HTMLInputElement;

	if (fileDefault.checked) await fileURLHandler("/static/shareware.zip");
	else if (fileURL.checked) {
		try {
			new URL(fileURLInput.value);
		} catch (e) {
			return;
		}

		await fileURLHandler(fileURLInput.value);
	}

	const preloadGameFiles = fileList.map(
		(file) =>
			new Promise<void>((resolve) =>
				gameModule.FS_createPreloadedFile(
					"/",
					file.name,
					file.data,
					true,
					false,
					() => resolve()
				)
			)
	);

	const runDependencies = [preloadPk3, ...preloadGameFiles];
	await Promise.all(runDependencies);

	gameModule.callMain(gameArguments);
};
