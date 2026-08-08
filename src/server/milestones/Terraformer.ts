import {IMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Terraformer implements IMilestone {
  public readonly name = 'Terraformer';
  public readonly description = 'Have a terraform rating of 35.';
  public getScore(player: IPlayer): number {
    return player.terraformRating;
  }
  public canClaim(player: IPlayer): boolean {
    return this.getScore(player) >= 35;
  }
}
