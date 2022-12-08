export interface GETLatestEventPayload {
	eventID: string;
	dist: string;
	userReport: {
		[k: string]: unknown;
	};
	previousEventID: string;
	message: string;
	id: string;
	size: number;
	errors: {
		message?: string;
		type?: string;
		data?: {
			[k: string]: unknown;
		};
		[k: string]: unknown;
	}[];
	platform: string;
	nextEventID: string;
	type: string;
	metadata:
		| {
				type: string;
				value: string;
				[k: string]: unknown;
		  }
		| {
				title: string;
				[k: string]: unknown;
		  };
	tags: {
		value?: string;
		key?: string;
		_meta?: string;
		[k: string]: unknown;
	}[];
	dateCreated: string;
	dateReceived: string;
	user: {
		username: string;
		name: string;
		ip_address: string;
		email: string;
		data: {
			isStaff?: boolean;
			[k: string]: unknown;
		};
		id: string;
		[k: string]: unknown;
	};
	entries: (
		| {
				type: string;
				data: {
					values: {
						category: string;
						level: string;
						event_id: string;
						timestamp: string;
						data: {
							[k: string]: unknown;
						};
						message: string;
						type: string;
						[k: string]: unknown;
					}[];
					[k: string]: unknown;
				};
				[k: string]: unknown;
		  }
		| {
				type: string;
				data: {
					fragment: string;
					cookies: string[][];
					inferredContentType: string;
					env: {
						ENV?: string;
						[k: string]: unknown;
					};
					headers: string[][];
					url: string;
					query: string[][];
					data: {
						[k: string]: unknown;
					};
					method: string;
					[k: string]: unknown;
				};
				[k: string]: unknown;
		  }
		| {
				type: string;
				data: {
					formatted: string;
					[k: string]: unknown;
				};
				[k: string]: unknown;
		  }
		| {
				type: string;
				data: {
					excOmitted: number[];
					hasSystemFrames: boolean;
					values: {
						stacktrace: {
							frames: {
								function: string;
								errors: string;
								colNo: number;
								vars: {
									[k: string]: unknown;
								};
								package: string;
								absPath: string;
								inApp: boolean;
								lineNo: number;
								module: string;
								filename: string;
								platform: string;
								instructionAddr: string;
								context: (number | string)[][];
								symbolAddr: string;
								trust: string;
								symbol: string;
								[k: string]: unknown;
							}[];
							framesOmitted: string;
							registers: string;
							hasSystemFrames: boolean;
							[k: string]: unknown;
						};
						module: string;
						rawStacktrace: {
							[k: string]: unknown;
						};
						mechanism: {
							type?: string;
							handled?: boolean;
							[k: string]: unknown;
						};
						threadId: string;
						value: string;
						type: string;
						[k: string]: unknown;
					}[];
					[k: string]: unknown;
				};
				[k: string]: unknown;
		  }
	)[];
	packages: {
		[k: string]: unknown;
	};
	sdk: {
		version?: string;
		name?: string;
		[k: string]: unknown;
	};
	_meta: {
		user?: string;
		context?: string;
		entries?: {
			[k: string]: unknown;
		};
		contexts?: string;
		message?: string;
		packages?: string;
		tags?: {
			[k: string]: unknown;
		};
		sdk?: string;
		[k: string]: unknown;
	};
	contexts: {
		[k: string]: unknown;
	};
	fingerprints: string[];
	context: {
		[k: string]: unknown;
	};
	release:
		| {
				authors: {
					[k: string]: unknown;
				}[];
				commitCount: number;
				data: {
					[k: string]: unknown;
				};
				dateCreated: string;
				dateReleased: string;
				deployCount: number;
				firstEvent: string;
				lastCommit: {
					[k: string]: unknown;
				};
				lastDeploy:
					| {
							environment: string;
							name: string;
							dateStarted: string;
							dateFinished: string;
							url: string;
							id: string;
							[k: string]: unknown;
					  }
					| {
							[k: string]: unknown;
					  };
				lastEvent: string;
				newGroups: number;
				owner: {
					[k: string]: unknown;
				};
				projects: {
					name?: string;
					slug?: string;
					[k: string]: unknown;
				}[];
				ref: string;
				shortVersion: string;
				version: string;
				url: string;
				[k: string]: unknown;
		  }
		| {
				[k: string]: unknown;
		  };
	groupID: string;
	title: string;
	[k: string]: unknown;
}
