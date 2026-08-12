import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {GlobalParameter} from '@/common/GlobalParameter';
import {ConstRandom} from '@/common/utils/Random';
import {Game} from '@/server/Game';
import {Player} from '@/server/Player';
import {ParameterMaximizerStrategy} from '@/server/bots/ParameterMaximizerStrategy';
import {assignBotStrategy} from '@/server/bots/BotStrategy';
import * as constants from '@/common/constants';
import {setTemperature} from '../TestingUtils';
import {CrediCor} from '@/server/cards/corporation/CrediCor';
import {EcoLine} from '@/server/cards/corporation/EcoLine';

describe('ParameterMaximizerStrategy', () => {
  it('is one of the strategies available for random assignment', () => {
    expect(assignBotStrategy(new ConstRandom(0))).eq('rando');
    expect(assignBotStrategy(new ConstRandom(0.75))).eq('parameter-maximizer');
  });

  it('selects the corporation with the highest starting money', () => {
    const strategy = new ParameterMaximizerStrategy();

    expect(strategy.selectCorporation([new EcoLine(), new CrediCor()], new ConstRandom(0))?.name).eq(CardName.CREDICOR);
  });

  it('performs the standard project for its selected parameter', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    human.clearWaitingFor();
    bot.clearWaitingFor();
    bot.botStrategy = 'parameter-maximizer';
    bot.botParameter = GlobalParameter.TEMPERATURE;
    bot.megaCredits = 14;
    const temperature = game.getTemperature();

    expect(new ParameterMaximizerStrategy().takeAction(bot)).is.true;

    expect(game.getTemperature()).eq(temperature + 2);
    expect(bot.megaCredits).eq(0);
    expect([...bot.standardProjectsThisGeneration]).deep.eq([CardName.ASTEROID_STANDARD_PROJECT]);
  });

  it('preserves its selected parameter when serialized', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    bot.botStrategy = 'parameter-maximizer';
    bot.botParameter = GlobalParameter.OCEANS;

    const restored = Player.deserialize(bot.serialize());

    expect(restored.botStrategy).eq('parameter-maximizer');
    expect(restored.botParameter).eq(GlobalParameter.OCEANS);
  });

  it('chooses a new parameter after its selected parameter is maximized', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    bot.botParameter = GlobalParameter.TEMPERATURE;
    setTemperature(game, constants.MAX_TEMPERATURE);

    expect(new ParameterMaximizerStrategy().takeAction(bot)).is.false;

    expect(bot.botParameter).not.eq(GlobalParameter.TEMPERATURE);
  });
});
