export class UserError extends Error {
	constructor(message: string, public status: number = 400) {
		super(message);
	}
}
