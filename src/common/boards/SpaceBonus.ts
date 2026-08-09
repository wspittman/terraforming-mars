// There might be a temptation to rename or reorder these, but SpaceBonus is stored in the database
// as its number. Would have been better if this was stored as a string, but that ship has sailed,
// for now.

export enum SpaceBonus {
    TITANIUM = 0, // 0
    STEEL = 1, // 1
    PLANT = 2, // 2
    DRAW_CARD = 3, // 3
    HEAT = 4, // 4

    // Ares-specific
    MEGACREDITS = 6, // 6
    ANIMAL = 7, // 7
    MICROBE = 8, // 8
    ENERGY = 9, // 9

    DATA = 10, // 10
    SCIENCE = 11, // 11
    ENERGY_PRODUCTION = 12, // 12

    ASTEROID = 15, // 15 // Used by Deimos Down Ares
}

const TO_STRING_MAP = {
  [SpaceBonus.TITANIUM]: 'Titanium',
  [SpaceBonus.STEEL]: 'Steel',
  [SpaceBonus.PLANT]: 'Plant',
  [SpaceBonus.DRAW_CARD]: 'Card',
  [SpaceBonus.HEAT]: 'Heat',
  [SpaceBonus.MEGACREDITS]: 'M€',
  [SpaceBonus.ANIMAL]: 'Animal',
  [SpaceBonus.MICROBE]: 'Microbe',
  [SpaceBonus.ENERGY]: 'Energy',
  [SpaceBonus.DATA]: 'Data',
  [SpaceBonus.SCIENCE]: 'Science',
  [SpaceBonus.ENERGY_PRODUCTION]: 'Energy Production',
  [SpaceBonus.ASTEROID]: 'Asteroid',
} satisfies Record<SpaceBonus, string>;

export namespace SpaceBonus {
  export function toString(spaceBonus: SpaceBonus): string {
    return TO_STRING_MAP[spaceBonus];
  }
}
