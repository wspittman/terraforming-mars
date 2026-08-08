import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Constructor implements IAward {
  public readonly name = 'Constructor';
  public readonly description = 'Have the most cities';

  public getScore(player: IPlayer): number {
    return player.game.board.getCities(player).length;
  }
}
