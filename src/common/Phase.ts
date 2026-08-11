/**
 * The different phases the game goes through. These do not perfectly match
 * to phases in the rulebook.
 *
 * A chart describing the phase transitions can be found at
 * https://docs.google.com/drawings/d/1OvSmFEWVxVuydRCVkWT1BVoqurKYeYNvKP-6htNjcCM/edit?usp=sharing
 */
export enum Phase {
  /**
   * Not part of the rulebook, initial drafting includes project cards.
   * Transitions to RESEARCH
   * but as mentioned above, only the first generation type of research.
   */
  INITIALDRAFTING = 'initial_drafting',

  /**
   * The phase where a player chooses cards to keep.
   * This includes the first generation drafting phase, which has different
   * behavior and transitions to a different eventual phase
   */
  RESEARCH = 'research',

  /** The standard between-generation drafting phase. */
  DRAFTING = 'drafting',

  /** Maps to rulebook action phase */
  ACTION = 'action',

  /** Maps to rulebook production phase */
  PRODUCTION = 'production',
  /** Standard rulebook Solar phase, triggers WGT, and final greeneries, but not Turmoil. */
  SOLAR = 'solar',
  /** The game is over. */
  END = 'end',
}
