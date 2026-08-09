export enum Tag {
    BUILDING = 'building',
    SPACE = 'space',
    SCIENCE = 'science',
    POWER = 'power',
    EARTH = 'earth',
    JOVIAN = 'jovian',
    PLANT = 'plant',
    MICROBE = 'microbe',
    ANIMAL = 'animal',
    CITY = 'city',
    EVENT = 'event',
}

export const ALL_TAGS = [
  Tag.BUILDING,
  Tag.SPACE,
  Tag.SCIENCE,
  Tag.POWER,
  Tag.EARTH,
  Tag.JOVIAN,
  Tag.PLANT,
  Tag.MICROBE,
  Tag.ANIMAL,
  Tag.CITY,
  Tag.EVENT,
] as const;
