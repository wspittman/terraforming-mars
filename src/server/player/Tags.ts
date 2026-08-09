// Methods for a player's relationship to their card tags

import {CardType} from '../../common/cards/CardType';
import {ALL_TAGS, Tag} from '../../common/cards/Tag';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';
import {OneOrArray} from '../../common/utils/types';
import {intersection} from '../../common/utils/utils';

export type CountingMode =
  'raw' | // Count face-up tags literally, including Leavitt Station.
  'default' | // Like raw, but include the wild tags and other deafult substitutions. Typical when performing an action.
  'milestone' | // Like raw with special conditions for milestones (Chimera)
  'award' | // Like raw with special conditions for awards (Chimera)
  'raw-pf' | // Like raw, but includes Mars Tags when tag is Science (Habitat Marte)
  'raw-underworld' // Like raw, but includes tags on events

export type DistinctCountMode =
  'default' | // Count all tags in played cards, and then add in all the wild tags.
  'milestone' | // Like default with special conditions for milestones (Chimera)
  'globalEvent'; // Like default, but does not apply wild tags, which are used in the action phase.

export type MultipleCountMode =
  'default' | // Count each tag individually, add wild tags, and (Moon) Earth Embassy.
  'milestone' | // Like default, including Chimera.
  'award'; // Like default, including Chimera.

/**
 * Provides common behaviors for analyzing tags on cards.
 *
 * Most everything is meant to match observable behavior. It also takes into account some special
 * card behaviors:
 *
 * 1. Odyssey (PF) leaves events face up, so their tags count.
 * 2. Earth Embassy (Moon) counts Moon tags count as Earth tags.
 * 3. Habitat Marte (PF) Mars tags count as science tags.
 * 4. Chimera (PF) has two wild tags, but only count as one tag for milestones and (funding) awards.
 *
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
  public count(tag: Tag, mode: CountingMode = 'default') {
    let tagCount = this.rawCount(tag, mode === 'raw-underworld');
    if (tag === Tag.SCIENCE) {
      tagCount += this.extraScienceTags;
    }
    if (tag === Tag.PLANT) {
      tagCount += this.extraPlantTags;
    }
    if (tag === Tag.JOVIAN) {
      tagCount += this.extraJovianTags;
    }
    if ((mode === 'default' || mode === 'milestone') && tag !== Tag.WILD) {
      tagCount += this.rawCount(Tag.WILD, false);
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
  public multipleCount(tags: Array<Tag>, mode: MultipleCountMode = 'default'): number {
    let tagCount = tags.reduce((sum, tag) => sum + this.rawCount(tag, false), 0);
    if (mode !== 'award') {
      tagCount += this.rawCount(Tag.WILD, false);
    }
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
   * Return the number of tags in this game, excluding events, wild, and clone tags.
   *
   * This is also the maximum value that distinctTagCount can return.
   */
  // Public for testing
  public tagsInGame(): number {
    const tags = this.player.game.tags;
    if (this._tagsInGame === 0) {
      const i = intersection(tags, [Tag.EVENT, Tag.CLONE, Tag.WILD]);
      this._tagsInGame = tags.length - i.length;
    }
    return this._tagsInGame;
  }

  /**
   * Counts the number of distinct tags the player has.
   *
   * `extraTag` (optional) represents a tag from a card that is in the middle of being played. If the card had multiple tags,
   * this API could change, but right the additional argument is only used once.
   */
  public distinctCount(mode: DistinctCountMode, extraTag?: Tag): number {
    const uniqueTags = new Set<Tag>();
    let wildTagCount = 0;
    for (const card of this.player.tableau) {
      if (card.type === CardType.EVENT) {
        continue;
      }
      for (const tag of card.tags) {
        if (tag === Tag.WILD) {
          wildTagCount++;
        } else {
          uniqueTags.add(tag);
        }
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
    if (mode === 'globalEvent') {
      return uniqueTags.size;
    }
    return Math.min(uniqueTags.size + wildTagCount, this.tagsInGame());
  }

  // Return true if this player has all the tags in `tags` showing.
  public playerHas(tags: Array<Tag>): boolean {
    const distinctCount = tags.filter((tag) => this.count(tag, 'raw') > 0).length;
    return distinctCount + this.count(Tag.WILD) >= tags.length;
  }

  /**
   * Return the number of cards in the player's hand without tags.
   *
   * Wild tags are ignored in this computation because in every known case, more cards without
   * tags is better.
   *
   * Does not include Odyssey behavior.
   */
  public numberOfCardsWithNoTags(): number {
    return this.player.tableau.filter((card) =>
      card.type !== CardType.EVENT && card.tags.every((tag) => tag === Tag.WILD)).length;
  }
}
