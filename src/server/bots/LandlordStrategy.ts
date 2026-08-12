import {CardName} from '@/common/cards/CardName';
import {InputResponse} from '@/common/inputs/InputResponse';
import {Payment} from '@/common/inputs/Payment';
import {Random} from '@/common/utils/Random';
import {Board} from '@/server/boards/Board';
import type {Space} from '@/server/boards/Space';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import type {BotStrategy} from './BotStrategy';
import {
  selectRandomElement,
  selectWealthiestCorporation,
  tryClaimMilestone,
  tryConvertHeat,
  tryConvertPlants,
  tryFundAward,
} from './BotUtils';
import {RandoBotStrategy} from './RandoBotStrategy';

export class LandlordStrategy extends RandoBotStrategy implements BotStrategy {
  public override readonly name = 'landlord';

  public override selectCorporation(cards: Parameters<BotStrategy['selectCorporation']>[0], _random: Random) {
    return cards.find((card) => card.name === CardName.CREDICOR) ??
      cards.find((card) => card.name === CardName.THARSIS_REPUBLIC) ??
      selectWealthiestCorporation(cards);
  }

  public override takeAction(player: IPlayer): boolean {
    return tryClaimMilestone(player) ||
      tryFundAward(player) ||
      tryConvertHeat(player) ||
      tryConvertPlants(player) ||
      this.tryGreeneryProject(player) ||
      this.tryStandardProject(player, CardName.CITY_STANDARD_PROJECT);
  }

  public override selectInput(input: PlayerInput, random: Random, player?: IPlayer): InputResponse {
    if (!(input instanceof SelectSpace) || player === undefined) {
      return super.selectInput(input, random, player);
    }

    if (input.title === 'Select space for city tile') {
      return this.selectPreferredSpace(input.spaces, random, (space) =>
        player.game.board.getAdjacentSpaces(space).filter(Board.isGreenerySpace).length);
    }
    if (input.title === 'Select space for greenery tile') {
      return this.selectPreferredSpace(input.spaces, random, (space) =>
        player.game.board.getAdjacentSpaces(space)
          .filter((adjacent) => Board.isCitySpace(adjacent) && adjacent.player === player).length);
    }
    return super.selectInput(input, random, player);
  }

  private tryGreeneryProject(player: IPlayer): boolean {
    const available = player.game.board.getAvailableSpacesForGreenery(player);
    const hasGreenerySpaceByCity = player.game.board.spaces
      .filter((space) => Board.isCitySpace(space) && space.player === player)
      .some((city) => player.game.board.getAdjacentSpaces(city)
        .some((space) => available.includes(space)));
    return hasGreenerySpaceByCity && this.tryStandardProject(player, CardName.GREENERY_STANDARD_PROJECT);
  }

  private tryStandardProject(player: IPlayer, name: CardName): boolean {
    const project = player.game.getStandardProjects().find((candidate) => candidate.name === name);
    if (project === undefined || !project.canAct(player)) {
      return false;
    }
    project.payAndExecute(player, Payment.of({megacredits: project.getAdjustedCost(player)}));
    return true;
  }

  private selectPreferredSpace(
    spaces: ReadonlyArray<Space>,
    random: Random,
    score: (space: Space) => number,
  ): InputResponse {
    const bestScore = Math.max(...spaces.map(score));
    const space = selectRandomElement(spaces.filter((space) => score(space) === bestScore), random);
    if (space === undefined) {
      throw new Error(`Bot strategy ${this.name} has no space to select`);
    }
    return {type: 'space', spaceId: space.id};
  }
}
