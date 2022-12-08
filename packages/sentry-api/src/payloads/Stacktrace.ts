export interface Stacktrace {
	frames: Frame[];
	framesOmitted: null;
	registers: null;
	hasSystemFrames: boolean;
}

export interface Frame {
	filename: string;
	absPath: string;
	module: string;
	package: null;
	platform: null;
	instructionAddr: null;
	symbolAddr: null;
	function: string;
	rawFunction: null;
	symbol: null;
	context: Array<[number, string]>;
	lineNo: number;
	colNo: number;
	inApp: boolean;
	trust: null;
	errors: null;
	vars: null;
}
