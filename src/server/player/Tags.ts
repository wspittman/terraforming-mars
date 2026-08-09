// Methods for a player's relationship to their card tags

import {CardType} from '../../common/cards/CardType';
import {ALL_TAGS, Tag} from '../../common/cards/Tag';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';
import {OneOrArray} from '../../common/utils/types';

export type CountingMode =
  'raw' |
  'default' |
  'milestone' |
  'award'

export type DistinctCountMode =
  'default' |
  'milestone';

export type MultipleCountMode =
  'default' |
  'milestone' |
  'award';

/**
 * Provides common behaviors for analyzing tags on cards.
 *
 * Most everything is meant to match observable behavior.
 */
export class Tags {
  private player: IPlayer;

  // Leavitt Colony, Underworld
  public extraScienceTags: number;
  // Underworld
  public extraPlantTags: number;
  // Delta Project
  public extraJovianTags: number;

  constructor(player: IPlayer) {
    this.player = player;
    this.extraScienceTags = 0;
    this.extraPlantTags = 0;
    this.extraJovianTags = 0;
  }

  /**
   * Returns a count of tags on face-up cards, plus a count of events.
   */
  public countAllTags(): Record<Tag, number> {
    const counts: Record<Tag, number> = {} as Record<Tag, number>;
    for (const tag of ALL_TAGS) {
      if (tag === Tag.EVENT) {
        continue;
      }
      counts[tag] = this.count(tag, 'raw');
    }
    counts[Tag.EVENT] = this.player.getPlayedEventsCount();
    return counts;
  }

  /*
   * Get the number of tags this player has.
   */
  public count(tag: Tag, _mode: CountingMode = 'default') {
    let tagCount = this.rawCount(tag, false);
    if (tag === Tag.SCIENCE) {
      tagCount += this.extraScienceTags;
    }
    if (tag === Tag.PLANT) {
      tagCount += this.extraPlantTags;
    }
    if (tag === Tag.JOVIAN) {
      tagCount += this.extraJovianTags;
    }
    return tagCount;
  }

  /**
   * Returns true if `card` has `tag`. This includes Habitat Marte, but not wild tags and
   * not Earth Embassy.
   */
  public cardHasTag(card: ICard, target: Tag): boolean {
    return card.tags.includes(target) || target === Tag.EVENT && card.type === CardType.EVENT;
  }

  /**
   * Returns the number of tags on `card`. Takes Habitat Marte into account.
   */
  public cardTagCount(card: ICard, target: OneOrArray<Tag>): number {
    let count = 0;
    for (const tag of card.tags) {
      if (tag === target) {
        count++;
      } else if (Array.isArray(target) && target.includes(tag)) {
        count++;
      }
    }
    return count;
  }

  // Counts the tags in the player's play area.
  protected rawCount(tag: Tag, includeEventsTags: boolean) {
    let tagCount = this.player.playedCards.tags[tag];

    if (includeEventsTags) {
      tagCount += this.player.playedCards.eventTags[tag];
    }

    return tagCount;
  }

  /**
   * Return the total number of tags associated with these types.
   * Tag substitutions are included, and not counted repeatedly.
   */
  public multipleCount(tags: Array<Tag>, _mode: MultipleCountMode = 'default'): number {
    let tagCount = tags.reduce((sum, tag) => sum + this.rawCount(tag, false), 0);
    if (tags.includes(Tag.SCIENCE)) {
      tagCount += this.extraScienceTags;
    }
    if (tags.includes(Tag.PLANT)) {
      tagCount += this.extraPlantTags;
    }
    if (tags.includes(Tag.JOVIAN)) {
      tagCount += this.extraJovianTags;
    }
    return tagCount;
  }

  private _tagsInGame = 0;
  /**
   * Return the number of non-event tags in this game.
   *
   * This is also the maximum value that distinctTagCount can return.
   */
  // Public for testing
  public tagsInGame(): number {
    const tags = this.player.game.tags;
    if (this._tagsInGame === 0) {
      this._tagsInGame = tags.includes(Tag.EVENT) ? tags.length - 1 : tags.length;
    }
    return this._tagsInGame;
  }

  /**
   * Counts the number of distinct tags the player has.
   *
   * `extraTag` (optional) represents a tag from a card that is in the middle of being played. If the card had multiple tags,
   * this API could change, but right the additional argument is only used once.
   */
  public distinctCount(_mode: DistinctCountMode, extraTag?: Tag): number {
    const uniqueTags = new Set<Tag>();
    for (const card of this.player.tableau) {
      if (card.type === CardType.EVENT) {
        continue;
      }
      for (const tag of card.tags) {
        uniqueTags.add(tag);
      }
    }
    if (extraTag !== undefined) {
      uniqueTags.add(extraTag);
    }
    if (this.extraScienceTags > 0) {
      uniqueTags.add(Tag.SCIENCE);
    }
    if (this.extraPlantTags > 0) {
      uniqueTags.add(Tag.PLANT);
    }
    if (this.extraJovianTags > 0) {
      uniqueTags.add(Tag.JOVIAN);
    }
    return Math.min(uniqueTags.size, this.tagsInGame());
  }

  // Return true if this player has all the tags in `tags` showing.
  public playerHas(tags: Array<Tag>): boolean {
    const distinctCount = tags.filter((tag) => this.count(tag, 'raw') > 0).length;
    return distinctCount >= tags.length;
  }

  /**
   * Return the number of cards in the player's hand without tags.
   *
   * Event tags are not counted because event cards are not kept in the tableau.
   */
  public numberOfCardsWithNoTags(): number {
    return this.player.tableau.filter((card) =>
      card.type !== CardType.EVENT && card.tags.length === 0).length;
  }
}
