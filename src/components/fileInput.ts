import JSZip from "jszip";
import errorHandler from "./errorHandler";
import { GameFileList } from "../types";

const fileDefault = document.getElementById("fileDefault") as HTMLInputElement;
const fileListDefault: GameFileList = [];

const fileURL = document.getElementById("fileURL") as HTMLInputElement;
const fileURLInput = document.getElementById(
	"fileURLInput"
) as HTMLInputElement;
let fileListURL: GameFileList = [];

const fileLocalFolder = document.getElementById(
	"fileLocalFolder"
) as HTMLInputElement;
const fileLocalFolderInput = document.getElementById(
	"fileLocalFolderInput"
) as HTMLInputElement;
let fileLocalFolderList: GameFileList = [];

const fileLocalZip = document.getElementById(
	"fileLocalZip"
) as HTMLInputElement;
const fileLocalZipInput = document.getElementById(
	"fileLocalZipInput"
) as HTMLInputElement;
let fileLocalZipList: GameFileList = [];

const checkFilename = (name: string): boolean =>
	name.endsWith(".n3d") ||
	name.endsWith(".sod") ||
	name.endsWith(".sd2") ||
	name.endsWith(".sd3") ||
	name.endsWith(".wl1") ||
	name.endsWith(".wl6");

const readerZipHandler = async (reader: FileReader, fileList: GameFileList) => {
	const content = await JSZip.loadAsync(reader.result as string);
	if (!content?.files) errorHandler("Invalid zip file");

	// Map every valid file in the zip to a promise
	const filePromises = Object.values(content.files)
		.filter((file) => checkFilename(file.name.toLowerCase()))
		.map(async (file) => {
			const fileContent = await file.async("blob");

			const readerZip = new FileReader();

			return new Promise<void>((resolve) => {
				readerZip.addEventListener("load", () => {
					fileList.push({
						name: file.name.split("/").pop() as string,
						data: readerZip.result as string
					});
					resolve();
				});

				readerZip.readAsDataURL(fileContent);
			});
		});

	if (!filePromises.length) errorHandler("No valid files in zip");

	// Waits until all files are loaded
	return Promise.all(filePromises);
};

const fileURLHandler = async (url: string, fileList: GameFileList) => {
	const file = await fetch(url)
		.then((res) => res.blob())
		.catch((e) => errorHandler(e as string));
	const reader = new FileReader();

	// Load the zip file and process files synchronously
	return new Promise<void>((resolve) => {
		reader.addEventListener("load", async () => {
			await readerZipHandler(reader, fileList);
			resolve();
		});

		reader.readAsArrayBuffer(file as Blob);
	});
};

export const fileRemoteInputSetup = async () => {
	if (fileDefault.checked && !fileListDefault.length)
		return await fileURLHandler("/static/shareware.zip", fileListDefault);
	else if (fileURL.checked) {
		try {
			new URL(fileURLInput.value);
		} catch (e) {
			errorHandler(e as string);
			return;
		}

		fileListURL = [];
		return await fileURLHandler(fileURLInput.value, fileListURL);
	}
};

export const fileLocalInputSetup = () => {
	fileLocalFolderInput.addEventListener("change", () => {
		if (!fileLocalFolderInput.files) {
			errorHandler("No files selected");
			return;
		}

		const inputFiles = [...fileLocalFolderInput.files].filter((file) =>
			checkFilename(file.name.toLowerCase())
		);
		if (!inputFiles.length) errorHandler("No valid files selected");

		fileLocalFolderList = [];

		for (const file of inputFiles) {
			const reader = new FileReader();

			reader.addEventListener("load", () =>
				fileLocalFolderList.push({
					name: file.name,
					data: reader.result as string
				})
			);

			reader.readAsDataURL(file);
		}
	});

	fileLocalZipInput.addEventListener("change", () => {
		if (!fileLocalZipInput.files) {
			errorHandler("No files selected");
			return;
		}

		fileLocalZipList = [];

		const file = fileLocalZipInput.files[0];
		const reader = new FileReader();

		if (!file.name.endsWith(".zip")) return;

		fileLocalZipList = [];
		reader.addEventListener("load", () =>
			readerZipHandler(reader, fileLocalZipList)
		);

		reader.readAsArrayBuffer(file);
	});
};

export const fileListSelect = () =>
	fileDefault.checked
		? fileListDefault
		: fileURL.checked
			? fileListURL
			: fileLocalFolder.checked
				? fileLocalFolderList
				: fileLocalZip.checked
					? fileLocalZipList
					: [];
