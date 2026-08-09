/**
 * Defines conditions for creating a card in a game, including conditions
 * when it will be included in a game.
 */
export type CardFactorySpec<T> = {
  // Creates a new instance of this card.
  Factory: new () => T;
  // False when the card should not be instantiated. It's reserved for fake and proxy cards.
  instantiate?: boolean;
}
