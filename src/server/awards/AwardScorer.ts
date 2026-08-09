import {PlayerId} from '../../common/Types';
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IAward} from './IAward';

export class AwardScorer {
  private scores: Map<PlayerId, number> = new Map();
  constructor(game: IGame, award: IAward) {
    for (const player of game.players) {
      this.scores.set(player.id, award.getScore(player));
    }
  }

  public get(player: IPlayer): number {
    // Ideally throw when player does not match, but this is OK.
    return this.scores.get(player.id) ?? 0;
  }
}
