export function hexStringToHexNumber(rrggbb: string) {
	return parseInt(rrggbb.replace("#", ""), 16);
}
