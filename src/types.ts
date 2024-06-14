export interface NavigatorExt extends Navigator {
	keyboard: {
		lock: () => Promise<void>;
		unlock: () => Promise<void>;
	};
}

export interface EmscriptenModuleExt extends EmscriptenModule {
	FS: typeof FS;
	onExit: () => void;
	// eslint-disable-next-line no-unused-vars
	callMain: (args: string[]) => void;
}

export type GameFileList = { name: string; data: string }[];
