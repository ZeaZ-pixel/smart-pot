export class PotEntity {
  constructor(
    public readonly id: number | null,
    public userId: number | null,
    public name: string,
    public temperature: number,
    public humidity: number,
    public soilMoisture: number,
    public photoresistor: number,
    public waterSensor: number,
    public vitaminSensor: number,
    public PHValue: number,
    public timestamp: Date = new Date(),
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
