export namespace Airport {
	export interface Config {
		channel?: string;
		arrives: boolean;
		arriveMessage: string;
		departs: boolean;
		departMessage: string;
		joinRole: string;
		giveJoinRole: boolean;
		ping: boolean;
	}
}
