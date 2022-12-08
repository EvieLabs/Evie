export interface Error {
	type: string;
	message: string;
	data: ErrorData;
}

export interface ErrorData {
	url: string;
}
