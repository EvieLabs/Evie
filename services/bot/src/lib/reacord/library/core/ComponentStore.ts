// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ComponentStore {
	private static readonly store: CustomId[] = [];

	public static componentExists(id: CustomId): boolean {
		return this.store.includes(id);
	}

	public static addComponent(id: CustomId): void {
		if (this.componentExists(id)) return;
		this.store.push(id);
	}
}

type CustomId = string;
