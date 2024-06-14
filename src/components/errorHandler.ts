/* eslint-disable no-console */
import { statusP } from "../main";
import { startButton } from "../main";

// Very basic status display for errors and loading message
const errorHandler = (e: string) => {
	statusP.textContent = e as string;
	console.error(e);
	startButton.disabled = false;
	throw new Error(e as string);
};

export default errorHandler;
