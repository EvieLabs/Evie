export function numberPrettifier(number: number, decimalPlaces = 1): string {
	const power = Math.pow(10, decimalPlaces);

	const abbreviation = ["k", "M", "B", "T"];

	for (let i = abbreviation.length - 1; i >= 0; i--) {
		const size = Math.pow(10, (i + 1) * 3);

		if (size <= number) {
			number = Math.round((number * power) / size) / power;

			if (number === 1000 && i < abbreviation.length - 1) {
				number = 1;
				i++;
			}

			return `${number}${abbreviation[i]}`;
		}
	}

	return number.toString();
}
