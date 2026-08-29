import {CardModel} from '../../common/models/CardModel';
import {Color} from '../../common/Color';
import {IGame} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {SimpleGameModel} from '../../common/models/SimpleGameModel';
import {GameOptionsModel} from '../../common/models/GameOptionsModel';
import {Board} from '../boards/Board';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';
import {PlayerViewModel, Protection, PublicPlayerModel} from '../../common/models/PlayerModel';
import {SpaceHighlight, SpaceModel} from '../../common/models/SpaceModel';
import {TileType} from '../../common/TileType';
import {Phase} from '../../common/Phase';
import {Resource} from '../../common/Resource';
import {ClaimedMilestoneModel, MilestoneScore} from '../../common/models/ClaimedMilestoneModel';
import {FundedAwardModel, AwardScore} from '../../common/models/FundedAwardModel';
import {SpectatorModel} from '../../common/models/SpectatorModel';
import {GameModel} from '../../common/models/GameModel';
import {AwardScorer} from '../awards/AwardScorer';
import {cardsToModel} from './ModelUtils';
import {runId} from '../utils/server-ids';
import {MAX_AWARDS, MAX_MILESTONES} from '../../common/constants';

export class Server {
  public static getSimpleGameModel(game: IGame): SimpleGameModel {
    return {
      activePlayer: game.activePlayer.color,
      id: game.id,
      name: game.name,
      phase: game.phase,
      players: game.playersInGenerationOrder.map((player) => ({
        color: player.color,
        id: player.id,
        name: player.name,
      })),
      spectatorId: game.spectatorId,
      gameOptions: this.getGameOptionsAsModel(game.gameOptions),
      lastSoloGeneration: game.lastSoloGeneration(),
      expectedPurgeTimeMs: game.expectedPurgeTimeMs(),
    };
  }

  public static getGameModel(game: IGame): GameModel {
    return {
      awards: this.getAwards(game),
      deckSize: game.projectDeck.drawPile.length,
      discardPileSize: game.projectDeck.discardPile.length,
      expectedPurgeTimeMs: game.expectedPurgeTimeMs(),
      gameAge: game.gameAge,
      gameOptions: this.getGameOptionsAsModel(game.gameOptions),
      generation: game.getGeneration(),
      globalsPerGeneration: game.gameIsOver() ? game.globalsPerGeneration : [],
      isSoloModeWin: game.isSoloModeWin(),
      isTerraformed: game.marsIsTerraformed(),
      lastSoloGeneration: game.lastSoloGeneration(),
      milestones: this.getMilestones(game),
      name: game.name,
      oceans: game.board.getOceanSpaces().length,
      oxygenLevel: game.getOxygenLevel(),
      passedPlayers: game.getPassedPlayers(),
      phase: game.phase,
      spaces: this.getSpaces(game.board),
      spectatorId: game.spectatorId,
      step: game.lastSaveId,
      temperature: game.getTemperature(),
      undoCount: game.undoCount,
    };
  }

  public static getPlayerModel(player: IPlayer): PlayerViewModel {
    const game = player.game;

    const players: Array<PublicPlayerModel> = game.playersInGenerationOrder.map((p) => this.getPlayer(p, p.color === player.color));

    const thisPlayerIndex = players.findIndex((p) => p.color === player.color);
    const thisPlayer: PublicPlayerModel = players[thisPlayerIndex];

    const rv: PlayerViewModel = {
      cardsInHand: cardsToModel(player, player.cardsInHand, {showCalculatedCost: true}),
      dealtCorporationCards: cardsToModel(player, player.dealtCorporationCards),
      dealtProjectCards: cardsToModel(player, player.dealtProjectCards),
      draftedCards: cardsToModel(player, player.draftedCards, {showCalculatedCost: true}),
      game: this.getGameModel(player.game),
      id: player.id,
      runId: runId,
      pickedCorporationCard: player.pickedCorporationCard ? cardsToModel(player, [player.pickedCorporationCard]) : [],
      thisPlayer: thisPlayer,
      waitingFor: this.getWaitingFor(player, player.getWaitingFor()),
      players: players,
      autopass: player.autopass,
    };
    return rv;
  }

  public static getSpectatorModel(game: IGame): SpectatorModel {
    return {
      color: 'neutral',
      id: game.spectatorId,
      game: this.getGameModel(game),
      players: game.playersInGenerationOrder.map((p) => this.getPlayer(p, false)),
      thisPlayer: undefined,
      runId: runId,
    };
  }

  public static getSelfReplicatingRobotsTargetCards(player: IPlayer): Array<CardModel> {
    return player.getSelfReplicatingRobotsTargetCards().map((targetCard) => {
      const model: CardModel = {
        resources: targetCard.resourceCount,
        name: targetCard.name,
        calculatedCost: player.getCardCost(targetCard),
        isSelfReplicatingRobotsCard: true,
      };
      return model;
    });
  }

  public static getMilestones(game: IGame): Array<ClaimedMilestoneModel> {
    const allMilestones = game.milestones;
    const claimedMilestones = game.claimedMilestones;
    const milestoneModels: Array<ClaimedMilestoneModel> = [];

    for (const milestone of allMilestones) {
      const claimed = claimedMilestones.find(
        (m) => m.milestone.name === milestone.name,
      );
      let scores: Array<MilestoneScore> = [];
      if (claimed === undefined && claimedMilestones.length < MAX_MILESTONES) {
        scores = game.players.map((player) => ({
          color: player.color,
          score: milestone.getScore(player),
          claimable: milestone.canClaim(player),
        }));
      }

      milestoneModels.push({
        playerName: claimed?.player.name,
        color: claimed?.player.color,
        name: milestone.name,
        scores,
      });
    }

    return milestoneModels;
  }

  public static getAwards(game: IGame): Array<FundedAwardModel> {
    const fundedAwards = game.fundedAwards;
    const awardModels: Array<FundedAwardModel> = [];

    for (const award of game.awards) {
      const funded = fundedAwards.find((a) => a.award.name === award.name);
      const scorer = new AwardScorer(game, award);
      let scores: Array<AwardScore> = [];
      if (fundedAwards.length < MAX_AWARDS || funded !== undefined) {
        scores = game.players.map((player) => ({
          color: player.color,
          score: scorer.get(player),
        }));
      }

      awardModels.push({
        playerName: funded?.player.name,
        color: funded?.player.color,
        name: award.name,
        scores: scores,
      });
    }

    return awardModels;
  }

  public static getWaitingFor(
    player: IPlayer,
    waitingFor: PlayerInput | undefined,
  ): PlayerInputModel | undefined {
    if (waitingFor === undefined) {
      return undefined;
    }
    // TODO(kberg): in theory this should be in all the other toModel calls.
    const model = waitingFor.toModel(player);
    model.warning = waitingFor.warning;
    return model;
    // showReset: player.game.inputsThisRound > 0 && player.game.resettable === true && player.game.phase === Phase.ACTION,
  }

  /** When the model is for this player, show the VP. Players like seeing their own VP even if the feature is off. */
  public static getPlayer(player: IPlayer, modelIsForThisPlayer: boolean): PublicPlayerModel {
    const game = player.game;
    const useHandicap = game.players.some((p) => p.handicap !== 0);
    const model: PublicPlayerModel = {
      actionsTakenThisRound: player.actionsTakenThisRound,
      actionsTakenThisGame: player.actionsTakenThisGame,
      actionsThisGeneration: Array.from(player.actionsThisGeneration),
      availableBlueCardActionCount: player.getPlayableActionCards().length,
      cardCost: player.cardCost,
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: game.board.getCities(player).length,
      color: player.color,
      energy: player.energy,
      energyProduction: player.production.energy,
      handicap: useHandicap ? player.handicap : undefined,
      heat: player.heat,
      heatProduction: player.production.heat,
      id: game.phase === Phase.END ? player.id : undefined,
      isActive: player.id === game.activePlayer.id,
      lastCardPlayed: player.lastCardPlayed,
      megacredits: player.megaCredits,
      megacreditProduction: player.production.megacredits,
      name: player.name,
      needsToDraft: player.needsToDraft,
      needsToResearch: !game.hasResearched(player),
      noTagsCount: player.tags.numberOfCardsWithNoTags(),
      plants: player.plants,
      plantProduction: player.production.plants,
      protectedResources: Server.getResourceProtections(player),
      protectedProduction: Server.getProductionProtections(player),
      tableau: cardsToModel(player, player.tableau.asArray(), {showResources: true}),
      selfReplicatingRobotsCards: Server.getSelfReplicatingRobotsTargetCards(player),
      steel: player.steel,
      steelProduction: player.production.steel,
      steelValue: player.getSteelValue(),
      tags: player.tags.countAllTags(),
      terraformRating: player.terraformRating,
      timer: player.timer.serialize(),
      titanium: player.titanium,
      titaniumProduction: player.production.titanium,
      titaniumValue: player.getTitaniumValue(),
      victoryPointsBreakdown: {
        terraformRating: 0,
        milestones: 0,
        awards: 0,
        greenery: 0,
        city: 0,
        escapeVelocity: 0,
        victoryPoints: 0,
        total: 0,
        detailsCards: [],
        detailsMilestones: [],
        detailsAwards: [],
      },
      victoryPointsByGeneration: [],
      globalParameterSteps: {},
    };

    if (game.phase === Phase.END || game.isSoloMode() ||
        game.gameOptions.showOtherPlayersVP === true || modelIsForThisPlayer) {
      model.victoryPointsBreakdown = player.getVictoryPoints();
      model.victoryPointsByGeneration = player.victoryPointsByGeneration;
      model.globalParameterSteps = player.globalParameterSteps;
    }

    return model;
  }

  private static getResourceProtections(player: IPlayer) {
    const protection: Record<Resource, Protection> = {
      megacredits: 'off',
      steel: 'off',
      titanium: 'off',
      plants: 'off',
      energy: 'off',
      heat: 'off',
    };

    if (player.alloysAreProtected()) {
      protection.steel = 'on';
      protection.titanium = 'on';
    }

    if (player.plantsAreProtected()) {
      protection.plants = 'on';
    }

    return protection;
  }

  private static getProductionProtections(player: IPlayer) {
    const defaultProteection = 'off';
    const protection: Record<Resource, Protection> = {
      megacredits: defaultProteection,
      steel: defaultProteection,
      titanium: defaultProteection,
      plants: defaultProteection,
      energy: defaultProteection,
      heat: defaultProteection,
    };

    if (player.alloysAreProtected()) {
      protection.steel = 'on';
      protection.titanium = 'on';
    }

    return protection;
  }

  // Oceans can't be owned so they shouldn't have a color associated with them
  // Land claim can have a color on a space without a tile
  private static getColor(space: Space): Color | undefined {
    if (
      (space.tile === undefined || space.tile.tileType !== TileType.OCEAN) &&
    space.player !== undefined
    ) {
      return space.player.color;
    }
    if (space.tile?.protectedHazard === true) {
      return 'bronze';
    }
    return undefined;
  }

  private static getSpaces(board: Board): Array<SpaceModel> {
    const noctisCitySpaceId = board.noctisCitySpaceId;

    return board.spaces.map((space) => {
      let highlight: SpaceHighlight = undefined;
      if (space.volcanic) {
        highlight = 'volcanic';
      } else if (noctisCitySpaceId === space.id) {
        highlight = 'noctis';
      }

      const model: SpaceModel = {
        x: space.x,
        y: space.y,
        id: space.id,
        spaceType: space.spaceType,
        bonus: space.bonus,
      };
      const tileType = space.tile?.tileType;
      if (tileType !== undefined) {
        model.tileType = tileType;
      }
      const color = this.getColor(space);
      if (color !== undefined) {
        model.color = color;
      }
      if (highlight !== undefined) {
        model.highlight = highlight;
      }
      if (space.tile?.rotated === true) {
        model.rotated = true;
      }
      return model;
    });
  }

  public static getGameOptionsAsModel(options: GameOptions): GameOptionsModel {
    return {
      boardName: options.boardName,
      bannedCards: options.bannedCards,
      escapeVelocity: options.escapeVelocity,
      corporateEra: options.corporateEra,
      fastModeOption: options.fastModeOption,
      includedCards: options.includedCards,
      showOtherPlayersVP: options.showOtherPlayersVP,
      showTimers: options.showTimers,
      shuffleMapOption: options.shuffleMapOption,
      soloTR: options.soloTR,
      twoCorpsVariant: options.twoCorpsVariant,
      undoOption: options.undoOption,
    };
  }
}
