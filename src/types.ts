/* eslint-disable no-unused-vars */
export interface NavigatorExt extends Navigator {
	keyboard: {
		lock: () => Promise<void>;
		unlock: () => Promise<void>;
	};
}

export interface EmscriptenModuleExt extends EmscriptenModule {
	FS: typeof FS;
	onExit: () => void;
	callMain: (args: string[]) => void;
	ccall: (
		func: string,
		returnType: string,
		argTypes: string[],
		args: unknown[]
	) => void;
}

export type GameFileList = { name: string; data: string }[];

export interface Options {
	fileDefault: boolean;
	fileURL: boolean;
	fileURLInput: string;
	fileLocalFolder: boolean;
	fileLocalFolderInput: string;
	fileLocalZip: boolean;
	fileLocalZipInput: string;
	argumentsInput: string;
}
