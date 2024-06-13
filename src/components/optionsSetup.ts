interface Options {
	fileDefault: boolean;
	fileURL: boolean;
	fileURLInput: string;
	fileLocalFolder: boolean;
	fileLocalFolderInput: string;
	fileLocalZip: boolean;
	fileLocalZipInput: string;
	argumentsInput: string;
}

const restoreOptions = () => {
	const storageOptions = JSON.parse(
		localStorage.getItem("options") as string
	) as Options;

	for (const [key, value] of Object.entries(storageOptions)) {
		const element = document.getElementById(key) as HTMLInputElement;
		if (!element) continue;
		if (element.type === "checkbox") element.checked = value;
		else element.value = value;
	}
};

const saveOptions = () => {
	const options = [
		...document.getElementsByClassName("option")
	] as HTMLInputElement[];

	const localOptions = options.map((element) => {
		if (element.type === "checkbox") return { [element.id]: element.checked };
		return { [element.id]: element.value };
	}) as unknown as Options;

	localStorage.setItem("options", JSON.stringify(localOptions));
};

const optionsSetup = () => {
	[...document.getElementsByClassName("option")].forEach((element) =>
		element.addEventListener("change", () => saveOptions())
	);

	if (localStorage.getItem("options")) restoreOptions();
};

export default optionsSetup;
