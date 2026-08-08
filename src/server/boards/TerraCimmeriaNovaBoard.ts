import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';

export class TerraCimmeriaNovaBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): TerraCimmeriaNovaBoard {
    const builder = new BoardBuilder(gameOptions, rng);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const COLONY = SpaceBonus.COLONY;

    // y=0
    builder.ocean().land(PLANT).volcanic(STEEL).land(PLANT).ocean(PLANT, PLANT);
    // y=1
    builder.ocean(TITANIUM, TITANIUM).land().land().land().land(PLANT, STEEL).ocean(PLANT);
    // y=2
    builder.land().land().land(COLONY).doNotShuffleLastSpace().land().land().land(PLANT).land();
    // y=3
    builder.volcanic(STEEL).land().land(STEEL).land().land(STEEL, STEEL).land().volcanic(TITANIUM, TITANIUM).land(DRAW_CARD);
    // y=4
    builder.land().land().land().land(STEEL).land(STEEL).land(DRAW_CARD).land().land(STEEL, DRAW_CARD).ocean();
    // y=5
    builder.volcanic(DRAW_CARD, DRAW_CARD).land().land(TITANIUM, STEEL, STEEL).land().land(TITANIUM).land(STEEL, STEEL).land().land(STEEL, STEEL);
    // y=6
    builder.land(PLANT, PLANT).land(TITANIUM).land().land(PLANT, STEEL, STEEL).land(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT);
    // y=7
    builder.ocean().land(PLANT).land(TITANIUM).land(DRAW_CARD).land(PLANT, PLANT).ocean(PLANT, PLANT);
    // y=8
    builder.ocean(PLANT, PLANT).ocean(PLANT).ocean(PLANT).land(PLANT).ocean(PLANT);

    const spaces = builder.build();

    spaces.forEach((space) => space.bonus = space.bonus.filter((bonus) => bonus !== COLONY));
    return new TerraCimmeriaNovaBoard(spaces);
  }
}
