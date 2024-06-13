import JSZip from "jszip";

export let fileList: { name: string; data: string }[] = [];

const fileLocalFolderInput = document.getElementById(
	"fileLocalFolderInput"
) as HTMLInputElement;

const fileLocalZipInput = document.getElementById(
	"fileLocalZipInput"
) as HTMLInputElement;

const checkFilename = (name: string): boolean =>
	name.endsWith(".n3d") ||
	name.endsWith(".sod") ||
	name.endsWith(".sd2") ||
	name.endsWith(".sd3") ||
	name.endsWith(".wl1") ||
	name.endsWith(".wl6");

const readerZipHandler = async (reader: FileReader) => {
	const content = await JSZip.loadAsync(reader.result as string);
	if (!content?.files) return;

	const filePromises = Object.values(content.files).map(async (file) => {
		const fileContent = await file.async("blob");

		const readerZip = new FileReader();

		return new Promise<void>((resolve) => {
			readerZip.addEventListener("load", () => {
				if (checkFilename(file.name.toLowerCase()))
					fileList.push({
						name: file.name.split("/").pop() as string,
						data: readerZip.result as string
					});
				resolve();
			});

			readerZip.readAsDataURL(fileContent);
		});
	});

	return Promise.all(filePromises);
};

export const fileURLHandler = async (url: string) => {
	fileList = [];

	const file = await fetch(url).then((res) => res.blob());
	const reader = new FileReader();

	return new Promise<void>((resolve) => {
		reader.addEventListener("load", async () => {
			await readerZipHandler(reader);
			resolve();
		});

		reader.readAsArrayBuffer(file);
	});
};

const fileInputSetup = () => {
	// Local files are handled here because they don't need to be fetched
	fileLocalFolderInput.addEventListener("change", () => {
		if (!fileLocalFolderInput.files) return;

		fileList = [];

		for (const file of fileLocalFolderInput.files) {
			const reader = new FileReader();

			if (checkFilename(file.name.toLowerCase())) {
				reader.addEventListener("load", () =>
					fileList.push({
						name: file.name,
						data: reader.result as string
					})
				);

				reader.readAsDataURL(file);
			}
		}
	});

	fileLocalZipInput.addEventListener("change", () => {
		if (!fileLocalZipInput.files) return;

		fileList = [];

		const file = fileLocalZipInput.files[0];
		const reader = new FileReader();

		if (!file.name.endsWith(".zip")) return;
		reader.addEventListener("load", () => readerZipHandler(reader));

		reader.readAsArrayBuffer(file);
	});
};

export default fileInputSetup;
