export class Pot {
  constructor(
    public readonly id: number | null,
    public name: string,
    public temperature: number | null,
    public humidity: number | null,
    public soilMoisture: number | null,
    public photoresistor: number | null,
    public waterSensor: number | null,
    public vitaminSensor: number | null,
    public PHValue: number | null,
    public timestamp: Date,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
