import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';

export function sortActiveCards(inCards: ReadonlyArray<CardModel>): ReadonlyArray<CardModel> {
  const firstCardIndex = -1;
  return inCards.slice().sort(function(cardA: CardModel, cardB: CardModel) {
    return (ActiveCardsSortingOrder.get(cardA.name) || firstCardIndex) - (ActiveCardsSortingOrder.get(cardB.name) || firstCardIndex);
  });
}

export const ActiveCardsSortingOrder: Map<CardName, number> = new Map([
  // Universal discount
  CardName.EARTH_CATAPULT,
  CardName.ANTI_GRAVITY_TECHNOLOGY,
  CardName.RESEARCH_OUTPOST,

  // Space discount
  CardName.MASS_CONVERTER,
  CardName.QUANTUM_EXTRACTOR,
  CardName.SPACE_STATION,
  CardName.SHUTTLES,

  // Other discount
  CardName.EARTH_OFFICE,

  // Rebate
  CardName.MEDIA_GROUP,
  CardName.OPTIMAL_AEROBRAKING,
  CardName.STANDARD_TECHNOLOGY,
  CardName.ROVER_CONSTRUCTION,

  // Colonies

  // Cash generator
  CardName.ELECTRO_CATAPULT,
  CardName.SPACE_ELEVATOR,
  CardName.MARTIAN_RAILS,
  CardName.POWER_INFRASTRUCTURE,

  // Card draw (active)
  CardName.AI_CENTRAL,
  CardName.RESTRICTED_AREA,
  CardName.DEVELOPMENT_CENTER,
  CardName.INVENTORS_GUILD,
  CardName.BUSINESS_NETWORK,

  // Card draw (passive)
  CardName.MARS_UNIVERSITY,
  CardName.OLYMPUS_CONFERENCE,

  // Non-jovian floaters

  // Jovian floater

  // Asteroid cards

  // energy engine
  CardName.PHYSICS_COMPLEX,
  CardName.ORE_PROCESSOR,
  CardName.STEELWORKS,
  CardName.IRONWORKS,

  // TR engine
  CardName.EQUATORIAL_MAGNETIZER,
  CardName.AQUIFER_PUMPING,
  CardName.WATER_IMPORT_FROM_EUROPA,
  CardName.CARETAKER_CONTRACT,

  // Other useful actions
  CardName.SPACE_MIRRORS,
  CardName.UNDERGROUND_DETONATIONS,

  // Animals (active)
  CardName.PREDATORS,
  CardName.FISH,
  CardName.BIRDS,
  CardName.LIVESTOCK,
  CardName.SMALL_ANIMALS,

  // Animals (passive)
  CardName.PETS,
  CardName.ECOLOGICAL_ZONE,
  CardName.HERBIVORES,

  // Microbes
  CardName.EXTREME_COLD_FUNGUS,
  CardName.SYMBIOTIC_FUNGUS,
  CardName.ANTS,
  CardName.REGOLITH_EATERS,
  CardName.GHG_PRODUCING_BACTERIA,
  CardName.NITRITE_REDUCING_BACTERIA,
  CardName.TARDIGRADES,
  CardName.DECOMPOSERS,

  // Point generator
  CardName.SEARCH_FOR_LIFE,
  CardName.SECURITY_FLEET,

  // Other passive cards
  CardName.PROTECTED_HABITATS,
  CardName.ARCTIC_ALGAE,
  CardName.VIRAL_ENHANCERS,
  CardName.ADAPTATION_TECHNOLOGY,
  CardName.IMMIGRANT_CITY,

  // Alloys
  CardName.ADVANCED_ALLOYS,
].map((card, index) => [card, index+1]));
