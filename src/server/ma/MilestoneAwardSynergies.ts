class SynergyMap {
  private readonly map: Map<string, number> = new Map();

  public set(a: string, b: string, weight: number): void {
    this.map.set(`${a}|${b}`, weight);
    this.map.set(`${b}|${a}`, weight);
  }

  public get(a: string, b: string): number {
    return this.map.get(`${a}|${b}`) ?? 0;
  }
}

export const synergies = new SynergyMap();
synergies.set('Gardener', 'Landlord', 6);
