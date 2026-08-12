import {CardName} from '@/common/cards/CardName';
import * as constants from '@/common/constants';
import {GLOBAL_PARAMETERS, GlobalParameter} from '@/common/GlobalParameter';
import {Payment} from '@/common/inputs/Payment';
import {Random} from '@/common/utils/Random';
import {IPlayer} from '@/server/IPlayer';
import {BotStrategy} from './BotStrategy';
import {RandoBotStrategy} from './RandoBotStrategy';
import {
  selectRandomElement,
  selectWealthiestCorporation,
  tryClaimMilestone,
  tryConvertHeat,
  tryConvertPlants,
  tryFundAward,
} from './BotUtils';

const PROJECT_BY_PARAMETER: Readonly<Record<GlobalParameter, CardName>> = {
  [GlobalParameter.OCEANS]: CardName.AQUIFER_STANDARD_PROJECT,
  [GlobalParameter.OXYGEN]: CardName.GREENERY_STANDARD_PROJECT,
  [GlobalParameter.TEMPERATURE]: CardName.ASTEROID_STANDARD_PROJECT,
};

export class ParameterMaximizerStrategy extends RandoBotStrategy implements BotStrategy {
  public override readonly name = 'parameter-maximizer';

  public override selectCorporation(cards: Parameters<BotStrategy['selectCorporation']>[0], _random: Random) {
    return selectWealthiestCorporation(cards);
  }

  public override takeAction(player: IPlayer): boolean {
    return tryClaimMilestone(player) ||
      tryFundAward(player) ||
      tryConvertHeat(player) ||
      tryConvertPlants(player) ||
      this.tryParameterProject(player);
  }

  private tryParameterProject(player: IPlayer): boolean {
    let parameter = player.botParameter ?? selectRandomElement(GLOBAL_PARAMETERS, player.game.rng);
    if (parameter === undefined) {
      return false;
    }
    let project = this.getProject(player, parameter);
    if (!this.isParameterAvailable(player, parameter)) {
      const available = GLOBAL_PARAMETERS.filter((candidate) => this.isParameterAvailable(player, candidate));
      parameter = selectRandomElement(available, player.game.rng);
      if (parameter === undefined) {
        return false;
      }
      project = this.getProject(player, parameter);
    }
    player.botParameter = parameter;
    if (project === undefined || !project.canAct(player)) {
      return false;
    }
    project.payAndExecute(player, Payment.of({megacredits: project.getAdjustedCost(player)}));
    return true;
  }

  private getProject(player: IPlayer, parameter: GlobalParameter) {
    return player.game.getStandardProjects().find((candidate) => candidate.name === PROJECT_BY_PARAMETER[parameter]);
  }

  private isParameterAvailable(player: IPlayer, parameter: GlobalParameter): boolean {
    switch (parameter) {
    case GlobalParameter.OCEANS:
      return player.game.canAddOcean();
    case GlobalParameter.OXYGEN:
      return player.game.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL;
    case GlobalParameter.TEMPERATURE:
      return player.game.getTemperature() < constants.MAX_TEMPERATURE;
    }
  }
}
