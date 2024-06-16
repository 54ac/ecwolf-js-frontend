import { Options } from "../types";

const defaultOptions: Options = {
	fileDefault: true,
	fileURL: false,
	fileURLInput: "",
	fileLocalFolder: false,
	fileLocalFolderInput: "",
	fileLocalZip: false,
	fileLocalZipInput: "",
	argumentsInput: ""
};

const optionElements = [
	...document.getElementsByClassName("option")
] as HTMLInputElement[];

const restoreOptions = () => {
	const storageOptions = JSON.parse(
		localStorage.getItem("options") as string
	) as Options;

	optionElements.forEach((option) => {
		const key: keyof Options = option.id as keyof Options;

		const value = storageOptions[key] || defaultOptions[key];

		if (option.type === "text") option.value = value as string;
		else option.checked = value as boolean;
	});
};

const saveOptions = () => {
	const localOptions = { ...defaultOptions };

	optionElements.forEach((option) => {
		const key = option.id as keyof Options;

		(localOptions[key] as Options[keyof Options]) =
			option.type === "text" ? option.value : option.checked;
	});

	localStorage.setItem("options", JSON.stringify(localOptions));
};

const optionsSetup = () => {
	optionElements.forEach((element) =>
		element.addEventListener("change", () => saveOptions())
	);

	if (localStorage.getItem("options")) restoreOptions();
};

export default optionsSetup;
