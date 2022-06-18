export class Monster {
  public name = this.data.name;
  public description = this.data.description;
  public health = this.data.health;

  public constructor(
    private data: {
      name: string;
      description: string;
      health: number;
    }
  ) {}
}
