import { CardResource } from '../common/CardResource';
import { CardName } from '../common/cards/CardName';
import { CardType } from '../common/cards/CardType';
import { Tag } from '../common/cards/Tag';
import { TRSource } from '../common/cards/TRSource';
import { Color } from '../common/Color';
import * as constants from '../common/constants';
import { MILESTONE_COST } from '../common/constants';
import { VictoryPointsBreakdown } from '../common/game/VictoryPointsBreakdown';
import { GlobalParameter } from '../common/GlobalParameter';
import { InputResponse } from '../common/inputs/InputResponse';
import {
  DEFAULT_PAYMENT_VALUES,
  Payment,
  PaymentOptions,
} from '../common/inputs/Payment';
import {
  CARD_FOR_SPENDABLE_RESOURCE,
  SPENDABLE_RESOURCES,
  SpendableCardResource,
  SpendableResource,
} from '../common/inputs/Spendable';
import { Message } from '../common/logs/Message';
import { Phase } from '../common/Phase';
import { Resource } from '../common/Resource';
import { Timer } from '../common/Timer';
import { PlayerId } from '../common/Types';
import { Units } from '../common/Units';
import {
  copyAndClear,
  inplaceRemove,
  sum,
  toName,
} from '../common/utils/utils';
import { IAward } from './awards/IAward';
import { getBehaviorExecutor } from './behavior/BehaviorExecutor';
import { Counter } from './behavior/Counter';
import { ConvertHeat } from './cards/base/standardActions/ConvertHeat';
import { ConvertPlants } from './cards/base/standardActions/ConvertPlants';
import { SellPatentsStandardProject } from './cards/base/standardProjects/SellPatentsStandardProject';
import { ICorporationCard } from './cards/corporation/ICorporationCard';
import { IActionCard, ICard, isIActionCard } from './cards/ICard';
import { IProjectCard } from './cards/IProjectCard';
import { IStandardProjectCard } from './cards/IStandardProjectCard';
import { PlayedCards } from './cards/PlayedCards';
import {
  cardsFromJSON,
  corporationCardsFromJSON,
  newCorporationCard,
} from './createCard';
import { ChooseCards } from './deferredActions/ChooseCards';
import { SimpleDeferredAction } from './deferredActions/DeferredAction';
import {
  AllOptions,
  DrawCards,
  DrawOptions,
} from './deferredActions/DrawCards';
import { Priority } from './deferredActions/Priority';
import { SelectPaymentDeferred } from './deferredActions/SelectPaymentDeferred';
import { newStandardDraft } from './Draft';
import { Game } from './Game';
import { calculateVictoryPoints } from './game/calculateVictoryPoints';
import { IGame } from './IGame';
import { OrOptions } from './inputs/OrOptions';
import { SelectCard } from './inputs/SelectCard';
import { SelectOption } from './inputs/SelectOption';
import { SelectProjectCardToPlay } from './inputs/SelectProjectCardToPlay';
import { SelectSpace } from './inputs/SelectSpace';
import { SelectStandardProjectToPlay } from './inputs/SelectStandardProjectToPlay';
import { UndoActionOption } from './inputs/UndoActionOption';
import { CanAffordOptions, CardAction, IPlayer } from './IPlayer';
import { LogHelper } from './LogHelper';
import { From } from './logs/From';
import { message } from './logs/MessageBuilder';
import { IMilestone } from './milestones/IMilestone';
import { Production } from './player/Production';
import { Stock } from './player/Stock';
import { Tags } from './player/Tags';
import { PlayerInput } from './PlayerInput';
import { SerializedPlayer } from './SerializedPlayer';
import { DiscordId } from './server/auth/discord';

const THROW_STATE_ERRORS = Boolean(process.env.THROW_STATE_ERRORS);
const DEFAULT_GLOBAL_PARAMETER_STEPS = {
  [GlobalParameter.OCEANS]: 0,
  [GlobalParameter.OXYGEN]: 0,
  [GlobalParameter.TEMPERATURE]: 0,
  [GlobalParameter.VENUS]: 0,
  [GlobalParameter.MOON_HABITAT_RATE]: 0,
  [GlobalParameter.MOON_MINING_RATE]: 0,
  [GlobalParameter.MOON_LOGISTIC_RATE]: 0,
} as const;

export class Player implements IPlayer {
  public readonly id: PlayerId;
  protected waitingFor?: PlayerInput;
  protected waitingForCb?: () => void;
  public game: IGame;
  public tags: Tags;
  public readonly production: Production;
  public readonly stock: Stock;
  public readonly opponents: ReadonlyArray<IPlayer> = [];

  // Used only during set-up
  public pickedCorporationCard?: ICorporationCard;

  // Terraforming Rating
  public terraformRating: number = 20;
  public hasIncreasedTerraformRatingThisGeneration: boolean = false;

  // Resource values
  private titaniumValue: number = 3;
  private steelValue: number = 2;
  // Helion
  public canUseHeatAsMegaCredits: boolean = false;
  // Martian Lumber Corp
  public canUsePlantsAsMegacredits: boolean = false;
  // Luna Trade Federation
  public canUseTitaniumAsMegacredits: boolean = false;

  // This generation / this round
  public actionsTakenThisRound: number = 0;
  public actionsThisGeneration: Set<CardName> = new Set();
  public lastCardPlayed: CardName | undefined;
  public pendingInitialActions: Array<ICorporationCard> = [];

  // Cards
  public dealtCorporationCards: Array<ICorporationCard> = [];
  public dealtProjectCards: Array<IProjectCard> = [];
  public cardsInHand: Array<IProjectCard> = [];
  public playedCards: PlayedCards = new PlayedCards();
  public draftedCards: Array<IProjectCard> = [];
  public draftHand: Array<IProjectCard> = [];
  public cardCost: number = constants.CARD_COST;
  public needsToDraft?: boolean;

  public timer: Timer = Timer.newInstance();
  public autopass = false;

  public politicalAgendasActionUsedCount: number = 0;

  public oceanBonus: number = constants.OCEAN_BONUS;

  // Custom cards
  // PoliticalAgendas Scientists P41
  // Ecoline
  public plantsNeededForGreenery: number = 8;
  // Lawsuit
  public removingPlayers: Array<PlayerId> = [];
  // Warmonger
  public warmongerCards: number = 0;
  // For Playwrights corp.
  // removedFromPlayCards is a bit of a misname: it's a temporary storage for
  // cards that provide 'next card' discounts. This will clear between turns.
  public removedFromPlayCards: Array<IProjectCard> = [];
  public preservationProgram = false;
  public standardProjectsThisGeneration: Set<CardName> = new Set();
  public temporaryGlobalParameterRequirementBonus = 0;

  // The number of actions a player can take this round.
  // It's almost always 2, but certain cards can change this value (Mars Maths, Tool with the First Order)
  public availableActionsThisRound = 2;


  // Stats
  public actionsTakenThisGame: number = 0;
  public victoryPointsByGeneration: Array<number> = [];
  public globalParameterSteps: Record<GlobalParameter, number> = {
    ...DEFAULT_GLOBAL_PARAMETER_STEPS,
  };

  public user?: DiscordId;

  public get megaCredits(): number {
    return this.stock.megacredits;
  }

  public get steel(): number {
    return this.stock.steel;
  }

  public get titanium(): number {
    return this.stock.titanium;
  }

  public get plants(): number {
    return this.stock.plants;
  }

  public get energy(): number {
    return this.stock.energy;
  }
  public get heat(): number {
    return this.stock.heat;
  }


  public set megaCredits(megacredits: number) {
    this.stock.megacredits = megacredits;
  }

  public set steel(steel: number) {
    this.stock.steel = steel;
  }

  public set titanium(titanium: number) {
    this.stock.titanium = titanium;
  }

  public set plants(plants: number) {
    this.stock.plants = plants;
  }

  public set energy(energy: number) {
    this.stock.energy = energy;
  }

  public set heat(heat: number) {
    this.stock.heat = heat;
  }


  constructor(
    public name: string,
    public color: Color,
    public beginner: boolean,
    public handicap: number = 0,
    id: PlayerId,
  ) {
    this.id = id;
    // This seems pretty bad. The game will be set before the Player is actually
    // used, and if that doesn't happen, well, it's a worthy error.
    // The alterantive, to make game type Game | undefined, will cause compilation
    // issues throughout the app.
    // Ideally the right thing is to invert how players and games get created.
    // But one thing at a time.
    this.game = undefined as unknown as Game;
    this.tags = new Tags(this);
    this.production = new Production(this);
    this.stock = new Stock(this);
  }

  public setup(game: IGame) {
    this.game = game;
    (this.opponents as Array<IPlayer>).push(
      ...game.players.filter((p) => p !== this),
    );
  }

  public tearDown() {
    this.game = undefined as unknown as Game;
  }

  /**
   * @deprecated use |playedCards|.
   */
  public get tableau(): PlayedCards {
    return this.playedCards;
  }

  public getTitaniumValue(): number {
    return this.titaniumValue;
  }

  public increaseTitaniumValue(): void {
    this.titaniumValue++;
  }

  public decreaseTitaniumValue(): void {
    if (this.titaniumValue > 0) {
      this.titaniumValue--;
    }
  }

  public getSelfReplicatingRobotsTargetCards(): Array<IProjectCard> {
    return [];
  }

  public getSteelValue(): number {
    return this.steelValue;
  }

  public increaseSteelValue(): void {
    this.steelValue++;
  }

  public decreaseSteelValue(): void {
    if (this.steelValue > 0) {
      this.steelValue--;
    }
  }

  public increaseTerraformRating(
    steps: number = 1,
    opts: { log?: boolean; from?: From } = {},
  ) {
    if (this.preservationProgram === true && this.game.phase === Phase.ACTION) {
      steps--;
      this.game.log('${0} for ${1} is blocking 1 TR', (b) =>
        b.cardName(CardName.PRESERVATION_PROGRAM).player(this),
      );
      this.preservationProgram = false;
      if (steps === 0) {
        return;
      }
    }
    const raiseRating = () => {
      this.terraformRating += steps;
      this.hasIncreasedTerraformRatingThisGeneration = true;

      if (opts.log === true) {
        if (opts.from !== undefined) {
          const from = opts.from;
          this.game.log('${0} gained ${1} TR from ${2}', (b) =>
            b.player(this).number(steps).from(from),
          );
        } else {
          this.game.log('${0} gained ${1} TR', (b) =>
            b.player(this).number(steps),
          );
        }
      }
      for (const cardOwner of this.game.playersInGenerationOrder) {
        for (const card of cardOwner.tableau) {
          card.onIncreaseTerraformRatingByAnyPlayer?.(cardOwner, this, steps);
        }
      }
    };

    raiseRating();
  }

  public decreaseTerraformRating(
    steps: number = 1,
    opts: { log?: boolean } = {},
  ) {
    this.terraformRating -= steps;
    if (opts.log === true) {
      this.game.log('${0} lost ${1} TR', (b) => b.player(this).number(steps));
    }
  }

  public setTerraformRating(value: number) {
    return (this.terraformRating = value);
  }

  public getVictoryPoints(): VictoryPointsBreakdown {
    return calculateVictoryPoints(this);
  }

  public plantsAreProtected(): boolean {
    return (
      this.playedCards.has(CardName.PROTECTED_HABITATS) ||
      this.playedCards.has(CardName.ASTEROID_DEFLECTION_SYSTEM)
    );
  }

  public alloysAreProtected(): boolean {
    return this.playedCards.has(CardName.LUNAR_SECURITY_STATIONS);
  }

  public isProtected(resource: Resource) {
    switch (resource) {
    case Resource.PLANTS:
      return this.plantsAreProtected();
    case Resource.STEEL:
    case Resource.TITANIUM:
      return this.alloysAreProtected();
    }
    return false;
  }

  public canHaveProductionReduced(
    resource: Resource,
    minQuantity: number,
    attacker: IPlayer,
  ) {
    const reducable =
      this.production[resource] + (resource === Resource.MEGACREDITS ? 5 : 0);
    if (reducable < minQuantity) {
      return false;
    }

    if (resource === Resource.STEEL || resource === Resource.TITANIUM) {
      if (this.alloysAreProtected()) {
        return false;
      }
    }

    // The pathfindersExpansion test is just an optimization for non-Pathfinders games.
    if (attacker !== this && this.playedCards.has(CardName.PRIVATE_SECURITY)) {
      return false;
    }
    return true;
  }

  public maybeBlockAttack(
    _perpetrator: IPlayer,
    _msg: Message | string,
    cb: (proceed: boolean) => PlayerInput | undefined,
  ): void {
    this.defer(cb(true));
  }

  public attack(
    perpetrator: IPlayer,
    resource: Resource,
    count: number,
    options?: { log?: boolean; stealing?: boolean },
  ): void {
    if (count === 0) {
      return;
    }
    if (count < 0) {
      throw new Error('Unexpected attack count is less than 0 ' + count);
    }
    const msg = message('Lose ${0} ${1}', (b) =>
      b.number(count).string(resource),
    );
    this.maybeBlockAttack(perpetrator, msg, (proceed) => {
      if (proceed) {
        if (options?.stealing) {
          this.stock.steal(resource, count, perpetrator, { log: options?.log });
        } else {
          this.stock.deduct(resource, count, {
            log: options?.log,
            from: { player: perpetrator },
          });
        }
      }
      return undefined;
    });
  }

  public resolveInsurance() {}

  public resolveInsuranceInSoloGame() {}


  /**
   * Return the number of events played by this player.
   *
   * When playing Pharmacy Union, if the card is discarded, then it sits in the event pile.
   * That's why it's included below. The FAQ describes how this applies to things like the
   * Legend Milestone, Media Archives, and NOT Media Group.
   */
  public getPlayedEventsCount(): number {
    let count = this.playedCards.eventCount;
    if (this.tableau.get(CardName.PHARMACY_UNION)?.isDisabled) {
      count++;
    }
    return count;
  }

  public getGlobalParameterRequirementBonus(
    parameter: GlobalParameter,
  ): number {
    let requirementsBonus = this.temporaryGlobalParameterRequirementBonus;
    for (const card of this.tableau) {
      requirementsBonus += card.getGlobalParameterRequirementBonus(
        this,
        parameter,
      );
    }

    return requirementsBonus;
  }

  public onGlobalParameterIncrease(
    parameter: GlobalParameter,
    steps: number,
  ): void {
    // Tracks this player's contributition to global parmeters for end-of-game reporting.
    this.globalParameterSteps[parameter] += steps;
  }

  public removeResourceFrom(
    card: ICard,
    count: number = 1,
    options?: { removingPlayer?: IPlayer; log?: boolean },
  ): void {
    const removingPlayer = options?.removingPlayer;
    if (card.resourceCount) {
      const amountRemoved = Math.min(card.resourceCount, count);
      if (amountRemoved === 0) {
        return;
      }
      card.resourceCount -= amountRemoved;

      if (removingPlayer !== undefined && removingPlayer !== this) {
        this.resolveInsurance();
      }

      if (options?.log ?? true) {
        this.game.log("${0} removed ${1} resource(s) from ${2}'s ${3}", (b) =>
          b
            .player(options?.removingPlayer ?? this)
            .number(amountRemoved)
            .player(this)
            .card(card),
        );
      }

      // Lawsuit hook
      if (
        removingPlayer !== undefined &&
        removingPlayer !== this &&
        this.removingPlayers.includes(removingPlayer.id) === false
      ) {
        this.removingPlayers.push(removingPlayer.id);
      }
      // Vermin hook (1 of 2)
      if (card.name === CardName.VERMIN) {
        this.game.verminInEffect = card.resourceCount >= 10;
      }
    }
  }

  public addResourceTo(
    card: ICard,
    options:
      | number
      | { qty?: number; log: boolean; logZero?: boolean; from?: From } = 1,
  ): void {
    const count = typeof options === 'number' ? options : (options.qty ?? 1);

    if (card.resourceCount !== undefined) {
      card.resourceCount += count;
    }

    if (typeof options !== 'number' && options.log === true) {
      if (options.logZero === true || count !== 0) {
        LogHelper.logAddResource(this, card, count, options.from);
      }
    }

    if (count > 0) {
      for (const playedCard of this.tableau) {
        playedCard.onResourceAdded?.(this, card, count);
      }
    }

    // Vermin hook (2 of 2)
    if (card.name === CardName.VERMIN) {
      this.game.verminInEffect = card.resourceCount >= 10;
    }
  }

  public getCardsWithResources(resource?: CardResource): Array<ICard> {
    let result = this.tableau.filter(
      (card) =>
        card.resourceType !== undefined &&
        card.resourceCount &&
        card.resourceCount > 0,
    );

    if (resource !== undefined) {
      result = result.filter((card) => card.resourceType === resource);
    }

    return result;
  }

  public getResourceCards(resource?: CardResource): Array<ICard> {
    let result = this.tableau.filter((card) => card.resourceType !== undefined);

    if (resource !== undefined) {
      result = result.filter(
        (card) =>
          card.resourceType === resource ||
          card.resourceType === CardResource.WARE,
      );
    }

    return result;
  }

  public getResourceCount(resource: CardResource): number {
    return sum(
      this.getCardsWithResources(resource).map((card) => card.resourceCount),
    );
  }

  public getPlayableActionCards(): Array<ICard & IActionCard> {
    const result: Array<ICard & IActionCard> = [];
    for (const card of this.tableau) {
      if (
        isIActionCard(card) &&
        !this.actionsThisGeneration.has(card.name)
      ) {
        if (card.canAct(this)) {
          result.push(card);
        }
      }
    }
    return result;
  }

  public runProductionPhase(): void {
    this.actionsThisGeneration.clear();
    this.removingPlayers = [];
    this.standardProjectsThisGeneration.clear();

    this.politicalAgendasActionUsedCount = 0;

    this.heat += this.energy;
    this.energy = 0;
    this.finishProductionPhase();
  }

  public finishProductionPhase() {
    this.megaCredits += this.production.megacredits + this.terraformRating;
    this.steel += this.production.steel;
    this.titanium += this.production.titanium;
    this.plants += this.production.plants;
    this.energy += this.production.energy;
    this.heat += this.production.heat;

    for (const card of this.tableau) {
      card.onProductionPhase?.(this);
    }
  }

  /**
   * ../..return {number} the number of avaialble megacredits. Which is just a shorthand for megacredits,
   * plus any units of heat available thanks to Helion (and Stormcraft, by proxy).
   */
  public spendableMegacredits(): number {
    let total = this.megaCredits;
    if (this.canUseHeatAsMegaCredits) {
      total += this.availableHeat();
    }
    if (this.canUseTitaniumAsMegacredits) {
      total += this.titanium * (this.titaniumValue - 1);
    }
    return total;
  }

  public runResearchPhase(): void {
    if (!this.game.gameOptions.draftVariant || this.game.isSoloMode()) {
      this.draftedCards = newStandardDraft(this.game).draw(this);
    }

    // If there are 4 cards to choose from, choose 4. If there are 5 because of Mars maths or Luna Project Office,
    // choose 4. If there are fewer cards because of an exhausted draw pile, draw whatever is available.
    let selectable = this.draftedCards.length;
    if (
      this.playedCards.has(CardName.MARS_MATHS) &&
      !this.playedCards.has(CardName.LUNA_PROJECT_OFFICE)
    ) {
      selectable = Math.min(selectable, 4);
    }

    const cards = copyAndClear(this.draftedCards);

    const chooseCardsToBuy = () => {
      // TODO(kberg): Using .execute to rely on directly calling setWaitingFor is not great.
      // It's because all players is drafting at the same time. Once again, the server isn't ideal
      // when it comes to handling multiple players at once.
      const action = new ChooseCards(this, cards, {
        paying: true,
        keepMax: selectable,
      }).execute();

      // ChooseCards.execute returns an action with an andThen set. That means
      // this has to wrap it around and do clever things.
      // Fortunately it's callback returns void, so this doesn't have to pass
      // something back another PlayerInput.
      const saved = action.cb;
      action.cb = (response) => {
        saved(response);
        this.game.playerIsFinishedWithResearchPhase(this);
        return undefined;
      };
      return action;
    };

    this.setWaitingFor(chooseCardsToBuy());
  }

  public getCardCost(card: IProjectCard): number {
    let cost = card.cost;

    for (const playedCard of this.tableau) {
      cost -= playedCard.getCardDiscount?.(this, card) ?? 0;
    }

    // Playwrights hook
    this.removedFromPlayCards.forEach((removedFromPlayCard) => {
      if (removedFromPlayCard.getCardDiscount !== undefined) {
        cost -= removedFromPlayCard.getCardDiscount(this, card);
      }
    });

    return Math.max(cost, 0);
  }

  private paymentOptionsForCard(card: IProjectCard): PaymentOptions {
    return {
      heat: this.canUseHeatAsMegaCredits,
      steel:
        this.lastCardPlayed === CardName.LAST_RESORT_INGENUITY ||
        card.tags.includes(Tag.BUILDING),
      plants:
        card.tags.includes(Tag.BUILDING) &&
        this.playedCards.has(CardName.MARTIAN_LUMBER_CORP),
      titanium:
        this.lastCardPlayed === CardName.LAST_RESORT_INGENUITY ||
        card.tags.includes(Tag.SPACE),
      lunaTradeFederationTitanium: this.canUseTitaniumAsMegacredits,
      seeds:
        card.tags.includes(Tag.PLANT) ||
        card.name === CardName.GREENERY_STANDARD_PROJECT,
      floaters: card.tags.includes(Tag.VENUS),
      microbes: card.tags.includes(Tag.PLANT),
      lunaArchivesScience: card.tags.includes(Tag.MOON),
      spireScience: card.type === CardType.STANDARD_PROJECT,
      auroraiData: card.type === CardType.STANDARD_PROJECT,
      graphene: card.tags.includes(Tag.CITY) || card.tags.includes(Tag.SPACE),
      kuiperAsteroids:
        card.name === CardName.AQUIFER_STANDARD_PROJECT ||
        card.name === CardName.ASTEROID_STANDARD_PROJECT,
    };
  }

  public checkPaymentAndPlayCard(
    selectedCard: IProjectCard,
    payment: Payment,
    cardAction: CardAction = 'add',
  ) {
    const cardCost = this.getCardCost(selectedCard);

    const reserved = selectedCard.reserveUnits ?? Units.EMPTY;

    if (!this.canSpend(payment, reserved)) {
      throw new Error('You do not have that many resources to spend');
    }

    if (payment.floaters > 0) {
      if (
        selectedCard.name === CardName.STRATOSPHERIC_BIRDS &&
        payment.floaters === this.getSpendable('floaters')
      ) {
        const cardsWithFloater = this.getCardsWithResources(
          CardResource.FLOATER,
        );
        if (cardsWithFloater.length === 1) {
          throw new Error(
            'Cannot spend all floaters to play Stratospheric Birds',
          );
        }
      }
    }

    if (payment.microbes > 0) {
      if (
        selectedCard.name === CardName.SOIL_ENRICHMENT &&
        payment.microbes === this.getSpendable('microbes')
      ) {
        const cardsWithMicrobe = this.getCardsWithResources(
          CardResource.MICROBE,
        );
        if (cardsWithMicrobe.length === 1) {
          throw new Error('Cannot spend all microbes to play Soil Enrichment');
        }
      }
    }

    // TODO(kberg): Move this.paymentOptionsForCard to a parameter.
    const totalToPay = this.payingAmount(
      payment,
      this.paymentOptionsForCard(selectedCard),
    );

    if (totalToPay < cardCost) {
      throw new Error('Did not spend enough to pay for card');
    }
    return this.playCard(selectedCard, payment, cardAction);
  }

  public resourcesOnCard(name: CardName): number {
    return this.playedCards.get(name)?.resourceCount ?? 0;
  }

  public getSpendable(SpendableResource: SpendableCardResource): number {
    return this.resourcesOnCard(CARD_FOR_SPENDABLE_RESOURCE[SpendableResource]);
  }

  public pay(payment: Payment) {
    const standardUnits = Units.of({
      megacredits: payment.megacredits,
      steel: payment.steel,
      titanium: payment.titanium,
      plants: payment.plants,
    });

    this.stock.deductUnits(standardUnits);

    if (payment.heat > 0) {
      this.defer(this.spendHeat(payment.heat));
    }

    const removeResourcesOnCard = (name: CardName, count: number) => {
      if (count === 0) {
        return;
      }
      const card = this.playedCards.get(name);
      if (card === undefined) {
        throw new Error('Card ' + name + ' not found');
      }
      // TODO(kberg): I suggest not logging this. Or do something fuller.
      this.removeResourceFrom(card, count, { log: true });
    };

    removeResourcesOnCard(CardName.PSYCHROPHILES, payment.microbes);
    removeResourcesOnCard(CardName.DIRIGIBLES, payment.floaters);
    removeResourcesOnCard(CardName.LUNA_ARCHIVES, payment.lunaArchivesScience);
    removeResourcesOnCard(CardName.SPIRE, payment.spireScience);
    removeResourcesOnCard(CardName.CARBON_NANOSYSTEMS, payment.graphene);
    removeResourcesOnCard(CardName.SOYLENT_SEEDLING_SYSTEMS, payment.seeds);
    removeResourcesOnCard(CardName.AURORAI, payment.auroraiData);
    removeResourcesOnCard(CardName.KUIPER_COOPERATIVE, payment.kuiperAsteroids);
  }

  public playCard(
    selectedCard: IProjectCard,
    payment?: Payment,
    cardAction: CardAction = 'add',
  ): void {
    if (payment !== undefined) {
      this.pay(payment);
    }


    if (selectedCard.type !== CardType.PROXY) {
      this.lastCardPlayed = selectedCard.name;
      this.game.log('${0} played ${1}', (b) =>
        b.player(this).card(selectedCard),
      );
    }

    // Play the card
    //
    // IMPORTANT: This is the wrong place to take the play card action.
    // It should be played after putting the card into the playedCards array.
    // That makes sense because every card that has an "including this" behavior is
    // actually hacked to +1 things. That's too bad. It means all our code and tests are
    // a little busted.
    //
    // By the way, this "including this" issue does not happen with corporation cards.
    //
    // This issue is evident when playing New Partner, and drawing Double Down.
    // The issue is fixed in Double Down for the time being. But the right fix is to move this block
    // down. As I say, that's going to break a lot of things, many of which are not evident
    // in tests (because they use card.play instad of player.playCard).
    const action = selectedCard.play(this);
    this.defer(action, Priority.DEFAULT);

    // This could probably include 'nothing' but for now this will work.
    if (cardAction !== 'discard') {
      // Remove card from hand
      const projectCardIndex = this.cardsInHand.findIndex(
        (card) => card.name === selectedCard.name,
      );
      if (projectCardIndex !== -1) {
        this.cardsInHand.splice(projectCardIndex, 1);
      }
    }

    switch (cardAction) {
    case 'add':
      if (
        selectedCard.name !== CardName.LAW_SUIT &&
          selectedCard.name !== CardName.PRIVATE_INVESTIGATOR
      ) {
        this.playedCards.push(selectedCard);
      }
      break;
      // Card is already played. Discard it.
    case 'discard':
      this.discardPlayedCard(selectedCard);
      break;
      // Do nothing. Good for fake cards and replaying events.
    case 'nothing':
      break;
      // Do nothing, used for Double Down.
    case 'double-down':
      break;
    }

    // See comment above regarding

    // See DeclareCloneTag for why this skips cards with clone tags.
    if (
      !selectedCard.tags.includes(Tag.CLONE) &&
      cardAction !== 'double-down'
    ) {
      this.onCardPlayed(selectedCard);
    }

    return undefined;
  }

  public triggerOnNonCardTagAdded(tag: Tag): void {
    for (const card of this.tableau) {
      card.onNonCardTagAdded?.(this, tag);
    }
  }

  public onCardPlayed(card: ICard) {
    if (card.type === CardType.PROXY) {
      return;
    }

    /* A player responding to their own cards played. */
    for (const effectCard of this.playedCards) {
      this.defer(effectCard.onCardPlayed?.(this, card));
    }


    /* A player responding to any other player's card played. */
    for (const somePlayer of this.game.playersInGenerationOrder) {
      for (const effectCard of somePlayer.playedCards) {
        const actionFromPlayedCard = effectCard.onCardPlayedByAnyPlayer?.(
          somePlayer,
          card,
          this,
        );
        this.defer(actionFromPlayedCard);
      }
    }
  }

  public playActionCard(): PlayerInput {
    return new SelectCard<ICard & IActionCard>(
      'Perform an action from a played card',
      'Take action',
      this.getPlayableActionCards(),
      { selectBlueCardAction: true },
    ).andThen(([card]) => {
      this.game.log('${0} used ${1} action', (b) => b.player(this).card(card));
      const action = card.action(this);
      this.defer(action);
      this.actionsThisGeneration.add(card.name);
      return undefined;
    });
  }

  public playCorporationCard(corporationCard: ICorporationCard): void {
    const additionalCorp = this.playedCards.corporations().length > 0;

    this.playedCards.push(corporationCard);

    // Update starting MC
    this.megaCredits += corporationCard.startingMegaCredits;
    // Update card cost.
    if (corporationCard.cardCost !== undefined) {
      this.cardCost += corporationCard.cardCost - constants.CARD_COST;
    }

    if (
      additionalCorp === false &&
      corporationCard.name !== CardName.BEGINNER_CORPORATION
    ) {
      const diff = this.cardsInHand.length * this.cardCost;
      this.stock.deduct(Resource.MEGACREDITS, diff);
    }
    this.game.log('${0} played ${1}', (b) =>
      b.player(this).card(corporationCard),
    );
    // Calculating this before playing the corporation card, which might change the player's hand size.
    const numberOfCardInHand = this.cardsInHand.length;
    this.defer(corporationCard.play(this));
    if (
      corporationCard.initialAction !== undefined &&
      corporationCard.initialActionText !== undefined
    ) {
      this.pendingInitialActions.push(corporationCard);
    }
    if (additionalCorp === false) {
      this.game.log('${0} kept ${1} project cards', (b) =>
        b.player(this).number(numberOfCardInHand),
      );
    }

    this.onCardPlayed(corporationCard);

    if (!additionalCorp) {
      this.game.playerIsFinishedWithResearchPhase(this);
    }
  }

  public drawCard(count?: number, options?: DrawOptions): undefined {
    return DrawCards.keepAll(this, count, options).execute();
  }

  public drawCardKeepSome(count: number, options: AllOptions): void {
    this.game.defer(DrawCards.keepSome(this, count, options));
  }

  public discardPlayedCard(card: IProjectCard) {
    const found = this.playedCards.remove(card);
    if (found === false) {
      console.error(`Error: card ${card.name} not in ${this.id}'s hand`);
      return;
    }
    this.game.projectDeck.discard(card);
    card.onDiscard?.(this);
    card.resourceCount = 0;
    this.game.log('${0} discarded ${1}', (b) => b.player(this).card(card));
  }

  public discardCardFromHand(card: IProjectCard, options?: { log?: boolean }) {
    const found = inplaceRemove(this.cardsInHand, card);
    if (found === false) {
      console.error(`Error: card ${card.name} not in ${this.id}'s hand`);
      return;
    }
    this.game.projectDeck.discard(card);
    if (options?.log === true) {
      this.game.log('${0} discarded ${1}', (b) => b.player(this).card(card), {
        reservedFor: this,
      });
    }
  }

  public availableHeat(): number {
    const floaters = this.resourcesOnCard(CardName.STORMCRAFT_INCORPORATED);
    return this.heat + floaters * 2;
  }

  public spendHeat(
    amount: number,
    cb: () => undefined | PlayerInput = () => undefined,
  ): PlayerInput | undefined {
    this.stock.deduct(Resource.HEAT, amount);
    return cb();
  }

  public claimableMilestones(): Array<IMilestone> {
    if (this.game.allMilestonesClaimed()) {
      return [];
    }
    const cost = this.milestoneCost();
    if (cost === 0 || this.canAfford(cost)) {
      return this.game.milestones.filter(
        (milestone) =>
          !this.game.milestoneClaimed(milestone) && milestone.canClaim(this),
      );
    }
    return [];
  }

  private claimMilestone(milestone: IMilestone) {
    if (this.game.milestoneClaimed(milestone)) {
      throw new Error(milestone.name + ' is already claimed');
    }

    const recordClaim = () => {
      this.game.log('${0} claimed ${1} milestone', (b) =>
        b.player(this).milestone(milestone),
      );
      this.game.claimedMilestones.push({
        player: this,
        milestone: milestone,
      });
      // VanAllen CEO Hook for Milestones
      const vanAllen = this.game.getCardPlayerOrUndefined(CardName.VANALLEN);
      if (vanAllen !== undefined) {
        vanAllen.stock.add(Resource.MEGACREDITS, 3, {
          log: true,
          from: { card: CardName.VANALLEN },
        });
      }
    };

    if (this.playedCards.has(CardName.VANALLEN)) {
      recordClaim();
    } else {
      const baseCost = this.milestoneCost();
      const cost = baseCost + (milestone.name === 'Briber' ? 12 : 0);
      const reserveUnits =
        milestone.name === 'Merchant' ? Units.every(2) : Units.EMPTY;
      this.game
        .defer(
          new SelectPaymentDeferred(this, cost, {
            title: 'Select how to pay for milestone',
            reserveUnits: reserveUnits,
          }),
        )
        .andThen(() => {
          recordClaim();
        });
    }
  }

  private isStagedProtestsActive() {
    const owner = this.game.getCardPlayerOrUndefined(CardName.STAGED_PROTESTS);
    if (owner === undefined) {
      return false;
    }
    const stagedProtests = owner.tableau.get(CardName.STAGED_PROTESTS);
    return stagedProtests?.generationUsed === this.game.generation;
  }

  public milestoneCost() {
    if (
      this.playedCards.has(CardName.VANALLEN) ||
      this.playedCards.has(CardName.NIRGAL_ENTERPRISES)
    ) {
      return 0;
    }
    return this.isStagedProtestsActive() ? MILESTONE_COST + 8 : MILESTONE_COST;
  }

  // Public for tests.
  public awardFundingCost() {
    if (this.playedCards.has(CardName.NIRGAL_ENTERPRISES)) {
      return 0;
    }
    const plus8 = this.isStagedProtestsActive() ? 8 : 0;
    return this.game.getAwardFundingCost() + plus8;
  }

  private fundAward(award: IAward): PlayerInput {
    return new SelectOption(
      award.name,
      'Fund - ' + '(' + award.name + ')',
    ).andThen(() => {
      this.game.defer(
        new SelectPaymentDeferred(this, this.awardFundingCost(), {
          title: 'Select how to pay for award',
        }),
      );
      this.game.fundAward(this, award);
      return undefined;
    });
  }

  private endTurnOption(): PlayerInput {
    return new SelectOption('End Turn', 'End').andThen(() => {
      this.actionsTakenThisRound = this.availableActionsThisRound; // This allows for variable actions per turn, like Mars Maths
      this.game.log('${0} ended turn', (b) => b.player(this));
      return undefined;
    });
  }

  public pass(): void {
    this.game.playerHasPassed(this);
    this.lastCardPlayed = undefined;
    this.autopass = false;
    this.game.log('${0} passed', (b) => b.player(this));
  }

  private passOption(): PlayerInput {
    const option = new SelectOption('Pass for this generation', 'Pass').andThen(
      () => {
        this.pass();
        return undefined;
      },
    );
    option.warnings = ['pass'];
    return option;
  }

  public takeActionForFinalGreenery(): void {
    const resolveFinalGreeneryDeferredActions = () => {
      this.game.deferredActions.runAll(() => this.takeActionForFinalGreenery());
    };

    // Resolve any deferredAction before placing the next greenery
    // Otherwise if two tiles are placed next to Philares, only the last benefit is triggered
    // if Philares does not accept the first bonus before the second tile is down
    if (this.game.deferredActions.length > 0) {
      resolveFinalGreeneryDeferredActions();
      return;
    }

    if (this.game.canPlaceGreenery(this)) {
      const action = new OrOptions()
        .setTitle('Place any final greenery from plants')
        .setButtonLabel('Confirm');
      action.options.push(
        new SelectSpace(
          'Select space for greenery tile',
          this.game.board.getAvailableSpacesForGreenery(this),
        ).andThen((space) => {
          // Do not raise oxygen or award TR for final greenery placements
          this.game.addGreenery(this, space, false);
          this.stock.deduct(Resource.PLANTS, this.plantsNeededForGreenery);

          // Resolve Philares deferred actions and maybe place another greenery
          resolveFinalGreeneryDeferredActions();
          return undefined;
        }),
      );
      action.options.push(
        new SelectOption("Don't place a greenery").andThen(() => {
          this.game.playerIsDoneWithGame(this);
          return undefined;
        }),
      );
      this.setWaitingForSafely(action);
      return;
    }

    if (this.game.deferredActions.length > 0) {
      resolveFinalGreeneryDeferredActions();
    } else {
      this.game.playerIsDoneWithGame(this);
    }
  }

  public getPlayableCards(): Array<IProjectCard> {
    const candidateCards: Array<IProjectCard> = [...this.cardsInHand];

    const playableCards: Array<IProjectCard> = [];
    for (const card of candidateCards) {
      card.clearWarnings();
      card.additionalProjectCosts = undefined;
      if (this.canPlay(card)) {
        playableCards.push(card);
      }
    }
    return playableCards;
  }

  public affordOptionsForCard(card: IProjectCard): CanAffordOptions {
    let trSource: TRSource = {};
    if (card.tr) {
      trSource = card.tr;
    } else {
      const computedTr = card.computeTr?.(this);
      if (computedTr !== undefined) {
        trSource = computedTr;
      } else if (card.behavior !== undefined) {
        trSource = getBehaviorExecutor().toTRSource(
          card.behavior,
          new Counter(this, card),
        );
      }
    }

    const pharmacyUnion = this.tableau.get(CardName.PHARMACY_UNION);
    if (
      (pharmacyUnion?.resourceCount ?? 0 > 0) &&
      this.tags.cardHasTag(card, Tag.SCIENCE)
    ) {
      trSource.tr = (trSource.tr ?? 0) + 1;
    }

    const cost = this.getCardCost(card);
    const paymentOptionsForCard = this.paymentOptionsForCard(card);
    return {
      cost,
      ...paymentOptionsForCard,
      reserveUnits: card.reserveUnits ?? Units.EMPTY,
      tr: trSource,
    };
  }

  public canPlay(card: IProjectCard): boolean {
    card.additionalProjectCosts = undefined;
    const options = this.affordOptionsForCard(card);
    const canAfford = this.canAffordInternal(options);
    if (!canAfford.canAfford) {
      return false;
    }
    const canPlay = card.canPlay(this, options);
    if (canPlay === false) {
      return false;
    }
    if (canAfford.redsCost > 0) {
      card.additionalProjectCosts = card.additionalProjectCosts ?? {};
      card.additionalProjectCosts.redsCost = canAfford.redsCost;
    }
    if (
      this.playedCards.has(CardName.PHARMACY_UNION) &&
      card.tags.includes(Tag.MICROBE)
    ) {
      const pharmacyUnion = this.tableau.get(CardName.PHARMACY_UNION);
      if (pharmacyUnion?.isDisabled === false) {
        card.addWarning('pharmacyUnion');
      }
    }
    return true;
  }

  /**
   * Returns the most you can spend if the given reserved units are excluded.
   */
  private maxSpendable(reserveUnits: Units = Units.EMPTY): Payment {
    return {
      megacredits: this.megaCredits - reserveUnits.megacredits,
      steel: this.steel - reserveUnits.steel,
      titanium: this.titanium - reserveUnits.titanium,
      plants: this.plants - reserveUnits.plants,
      heat: this.availableHeat() - reserveUnits.heat,
      floaters: this.getSpendable('floaters'),
      microbes: this.getSpendable('microbes'),
      lunaArchivesScience: this.getSpendable('lunaArchivesScience'),
      spireScience: this.getSpendable('spireScience'),
      seeds: this.getSpendable('seeds'),
      auroraiData: this.getSpendable('auroraiData'),
      graphene: this.getSpendable('graphene'),
      kuiperAsteroids: this.getSpendable('kuiperAsteroids'),
    };
  }

  public canSpend(payment: Payment, reserveUnits?: Units): boolean {
    const maxPayable = this.maxSpendable(reserveUnits);

    return SPENDABLE_RESOURCES.every(
      (key) => 0 <= payment[key] && payment[key] <= maxPayable[key],
    );
  }

  /**
   * Returns the value of the suppled payment given the payment options.
   *
   * For example, if the payment is 3M€ and 2 steel, given that steel by default is
   * worth 2M€, this will return 7.
   *
   * ../..param {Payment} payment the resources being paid.
   * ../..param {PaymentOptions} options any configuration defining the accepted form of payment.
   * ../..return {number} a number representing the value of payment in M€.
   */
  public payingAmount(
    payment: Payment,
    options?: Partial<PaymentOptions>,
  ): number {
    const multiplier = {
      ...DEFAULT_PAYMENT_VALUES,
      steel: this.getSteelValue(),
      titanium: this.getTitaniumValue(),
    };

    const usable: { [key in SpendableResource]: boolean } = {
      megacredits: true,
      steel: options?.steel ?? false,
      titanium: options?.titanium ?? false,
      heat: this.canUseHeatAsMegaCredits,
      plants: options?.plants ?? false,
      microbes: options?.microbes ?? false,
      floaters: options?.floaters ?? false,
      lunaArchivesScience: options?.lunaArchivesScience ?? false,
      spireScience: options?.spireScience ?? false,
      seeds: options?.seeds ?? false,
      auroraiData: options?.auroraiData ?? false,
      graphene: options?.graphene ?? false,
      kuiperAsteroids: options?.kuiperAsteroids ?? false,
    };

    // HOOK: Luna Trade Federation
    if (
      usable.titanium === false &&
      payment.titanium > 0 &&
      this.canUseTitaniumAsMegacredits
    ) {
      usable.titanium = true;
      multiplier.titanium -= 1;
    }

    let totalToPay = 0;
    for (const key of SPENDABLE_RESOURCES) {
      if (usable[key]) {
        totalToPay += payment[key] * multiplier[key];
      }
    }

    return totalToPay;
  }

  private static CANNOT_AFFORD = { canAfford: false, redsCost: 0 } as const;

  /**
   * Returns information about whether a player can afford to spend money with other costs and ways to pay taken into account.
   */
  private canAffordInternal(options: CanAffordOptions): {
    redsCost: number;
    canAfford: boolean;
  } {
    // TODO(kberg): These are set both here and in SelectPayment. Consolidate, perhaps.
    options.heat = this.canUseHeatAsMegaCredits;
    options.lunaTradeFederationTitanium = this.canUseTitaniumAsMegacredits;

    const reserveUnits = options.reserveUnits ?? Units.EMPTY;
    if (reserveUnits.heat > 0) {
      // Special-case heat
      const unitsWithoutHeat = { ...reserveUnits, heat: 0 };
      if (!this.stock.has(unitsWithoutHeat)) {
        return Player.CANNOT_AFFORD;
      }
      if (this.availableHeat() < reserveUnits.heat) {
        return Player.CANNOT_AFFORD;
      }
    } else {
      if (!this.stock.has(reserveUnits)) {
        return Player.CANNOT_AFFORD;
      }
    }

    const maxPayable = this.maxSpendable(reserveUnits);
    const usable = this.payingAmount(maxPayable, options);

    const canAfford = options.cost <= usable;
    return { canAfford, redsCost: 0 };
  }

  /**
   * Returns `true` if the player can afford to pay `options.cost` mc (possibly replaceable with steel, titanium etc.)
   * and additionally pay the reserveUnits (no replaces here)
   */
  public canAfford(o: number | CanAffordOptions): boolean {
    // Short circuit when players have enough MC.
    if (typeof o === 'number' && o <= this.stock.megacredits) {
      return true;
    }
    const options: CanAffordOptions =
      typeof o === 'number' ? { cost: o } : { ...o };
    return this.canAffordInternal(options).canAfford;
  }

  public getStandardProjectOption(): SelectStandardProjectToPlay {
    const standardProjects: Array<IStandardProjectCard> =
      this.game.getStandardProjects();

    return new SelectStandardProjectToPlay(this, standardProjects, {
      enabled: standardProjects.map((card) => card.canAct(this)),
      title: 'Standard projects',
      buttonLabel: 'Confirm',
    });
  }

  private headStartIsInEffect() {
    if (
      this.game.phase === Phase.PRELUDES &&
      this.playedCards.has(CardName.HEAD_START)
    ) {
      if (this.actionsTakenThisRound < 2) {
        return true;
      }
    }
    return false;
  }

  /**
   * Set up a player taking their next action.
   *
   * This method indicates the avalilable actions by setting the `waitingFor` attribute of this player.
   *
   * saveBeforeTakingAction when true, the game state is saved. Default is `true`. This
   * should only be false in testing and when this method is called during game deserialization. In other
   * words, don't set this value unless you know what you're doing.
   */
  // @ts-ignore saveBeforeTakingAction is unused at the moment.
  public takeAction(saveBeforeTakingAction: boolean = true): void {
    const game = this.game;

    if (game.deferredActions.length > 0) {
      game.deferredActions.runAll(() => this.takeAction());
      return;
    }

    if (this.actionsTakenThisRound === 0 || game.gameOptions.undoOption) {
      game.save();
    }
    // if (saveBeforeTakingAction) game.save();

    // Autopass is disabled.
    // if (this.autopass) {
    //   this.passOption().cb();
    // }
    const headStartIsInEffect = this.headStartIsInEffect();
    this.game.inDoubleDown = false;

    if (!headStartIsInEffect) {
      game.phase = Phase.ACTION;

      if (
        game.hasPassedThisActionPhase(this) ||
        (this.allOtherPlayersHavePassed() === false &&
          this.actionsTakenThisRound >= this.availableActionsThisRound)
      ) {
        this.actionsTakenThisRound = 0;
        this.availableActionsThisRound = 2;
        game.resettable = true;
        game.playerIsFinishedTakingActions();
        return;
      }
    }

    // Terraforming Mars FAQ says:
    //   If for any reason you are not able to perform your mandatory first action (e.g. if
    //   all 3 Awards are claimed before starting your turn as Vitor), you can skip this and
    //   proceed with other actions instead.
    // This code just uses "must skip" instead of "can skip".
    const vitor = this.tableau.get(CardName.VITOR);
    if (vitor !== undefined && this.game.allAwardsFunded()) {
      this.pendingInitialActions = this.pendingInitialActions.filter(
        (card) => card !== vitor,
      );
    }

    if (this.pendingInitialActions.length > 0) {
      const orOptions = new OrOptions();

      this.pendingInitialActions.forEach((corp) => {
        const option = new SelectOption(
          message('Take first action of ${0} corporation', (b) => b.card(corp)),
          corp.initialActionText,
        ).andThen(() => {
          (game.log('${0} took the first action of ${1} corporation', (b) =>
            b.player(this).card(corp),
          ),
          this.defer(corp.initialAction?.(this)));
          inplaceRemove(this.pendingInitialActions, corp);
          return undefined;
        });
        orOptions.options.push(option);
      });

      if (!headStartIsInEffect) {
        orOptions.options.push(this.passOption());
      }

      this.setWaitingFor(
        orOptions,
        this.runWhenEmpty(() => {
          if (this.pendingInitialActions.length === 0) {
            this.incrementActionsTaken();
          }
          this.timer.rebate(constants.BONUS_SECONDS_PER_ACTION * 1000);
          this.takeAction();
        }),
      );
      return;
    }

    this.setWaitingFor(
      this.getActions(),
      this.runWhenEmpty(() => {
        this.incrementActionsTaken();
        this.takeAction();
      }),
    );
  }

  private incrementActionsTaken(): void {
    this.actionsTakenThisRound++;
    this.actionsTakenThisGame++;
  }

  public /* for testing */ getActions() {
    const action = new OrOptions()
      .setTitle(
        this.actionsTakenThisRound === 0 ?
          'Take your first action' :
          'Take your next action',
      )
      .setButtonLabel('Take action');

    const claimableMilestones = this.claimableMilestones();
    if (claimableMilestones.length > 0) {
      const milestoneOption = new OrOptions().setTitle('Claim a milestone');
      milestoneOption.options = claimableMilestones.map((milestone) =>
        new SelectOption(
          milestone.name,
          'Claim - ' + '(' + milestone.name + ')',
        ).andThen(() => {
          this.claimMilestone(milestone);
          return undefined;
        }),
      );
      action.options.push(milestoneOption);
    }

    // Convert Plants
    const convertPlants = new ConvertPlants();
    if (convertPlants.canAct(this)) {
      action.options.push(convertPlants.action(this));
    }

    // Convert Heat
    const convertHeat = new ConvertHeat();
    if (convertHeat.canAct(this)) {
      const option = new SelectOption(
        'Convert 8 heat into temperature',
        'Convert heat',
      ).andThen(() => convertHeat.action(this));
      if (convertHeat.warnings.size > 0) {
        option.warnings = Array.from(convertHeat.warnings);
        if (convertHeat.warnings.has('maxtemp')) {
          option.eligibleForDefault = false;
        }
      }
      action.options.push(option);
    }

    // Action cards
    if (this.getPlayableActionCards().length > 0) {
      action.options.push(this.playActionCard());
    }


    // Playable cards
    const playableCards = this.getPlayableCards();
    if (playableCards.length !== 0) {
      action.options.push(new SelectProjectCardToPlay(this, playableCards));
    }

    // End turn
    if (
      this.game.players.length > 1 &&
      this.actionsTakenThisRound > 0 &&
      !this.game.gameOptions.fastModeOption &&
      this.allOtherPlayersHavePassed() === false
    ) {
      action.options.push(this.endTurnOption());
    }

    // Fund award
    const fundingCost = this.awardFundingCost();
    if (this.canAfford(fundingCost) && !this.game.allAwardsFunded()) {
      const remainingAwards = new OrOptions()
        .setTitle(
          message('Fund an award (${0} M€)', (b) => b.number(fundingCost)),
        )
        .setButtonLabel('Confirm');
      remainingAwards.options = this.game.awards
        .filter((award: IAward) => this.game.hasBeenFunded(award) === false)
        .map((award: IAward) => this.fundAward(award));
      action.options.push(remainingAwards);
    }

    // Standard Projects
    action.options.push(this.getStandardProjectOption());

    // Pass
    action.options.push(this.passOption());

    // Sell patents
    const sellPatents = new SellPatentsStandardProject();
    if (sellPatents.canAct(this)) {
      action.options.push(sellPatents.action(this));
    }

    // Propose undo action only if you have done one action this turn
    if (this.actionsTakenThisRound > 0 && this.game.gameOptions.undoOption) {
      action.options.push(new UndoActionOption());
    }

    return action;
  }

  private allOtherPlayersHavePassed(): boolean {
    const game = this.game;
    if (game.isSoloMode()) {
      return true;
    }
    const players = game.players;
    const passedPlayers = game.getPassedPlayers();
    return (
      passedPlayers.length === players.length - 1 &&
      passedPlayers.includes(this.color) === false
    );
  }

  public process(input: InputResponse): void {
    if (this.waitingFor === undefined || this.waitingForCb === undefined) {
      throw new Error('Not waiting for anything');
    }
    const waitingFor = this.waitingFor;
    const waitingForCb = this.waitingForCb;
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    try {
      if (!waitingFor.optional) {
        this.timer.stop();
      }
      this.defer(waitingFor.process(input, this));
      waitingForCb();
    } catch (err) {
      this.setWaitingFor(waitingFor, waitingForCb);
      throw err;
    }
  }

  public getWaitingFor(): PlayerInput | undefined {
    return this.waitingFor;
  }

  public setWaitingFor(input: PlayerInput, cb: () => void = () => {}): void {
    if (this.waitingFor !== undefined) {
      const message = `Overwriting waitingFor ${this.waitingFor.type} with ${input?.type}`;
      if (THROW_STATE_ERRORS) {
        throw new Error(message);
      } else {
        console.warn(message);
      }
    }
    if (!input.optional) {
      this.timer.start();
    }
    this.waitingFor = input;
    this.waitingForCb = cb;
    this.game.inputsThisRound++;
  }

  /**
   * A version of setWaitingFor that does not discard a setWaitingFor call whe
   * this player is already waiting for something. Instead, it modifies the
   * current waitingFor by wrapping it with behavior that calls the next setWaitingFor
   * when it finishes.
   *
   * This was only built for the Philares/Final Greenery case. Might not work elsewhere.
   */
  public setWaitingForSafely(
    input: PlayerInput,
    cb: () => void = () => {},
  ): void {
    if (this.waitingFor === undefined) {
      this.setWaitingFor(input, cb);
    } else {
      const savedcb = this.waitingForCb;
      if (savedcb === undefined) {
        this.waitingForCb = cb;
      } else {
        this.waitingForCb = () => {
          savedcb();
          this.setWaitingForSafely(input, cb);
        };
      }
    }
  }

  public clearWaitingFor(): void {
    const waitingFor = this.waitingFor;
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    if (waitingFor !== undefined && !waitingFor.optional) {
      this.timer.stop();
    }
  }

  public serialize(): SerializedPlayer {
    const result: SerializedPlayer = {
      id: this.id,
      user: this.user,
      // Used only during set-up
      pickedCorporationCard: this.pickedCorporationCard?.name,
      // Terraforming Rating
      terraformRating: this.terraformRating,
      hasIncreasedTerraformRatingThisGeneration:
        this.hasIncreasedTerraformRatingThisGeneration,
      // Resources
      megaCredits: this.megaCredits,
      megaCreditProduction: this.production.megacredits,
      steel: this.steel,
      steelProduction: this.production.steel,
      titanium: this.titanium,
      titaniumProduction: this.production.titanium,
      plants: this.plants,
      plantProduction: this.production.plants,
      energy: this.energy,
      energyProduction: this.production.energy,
      heat: this.heat,
      heatProduction: this.production.heat,
      // Resource values
      titaniumValue: this.titaniumValue,
      steelValue: this.steelValue,
      // Helion
      canUseHeatAsMegaCredits: this.canUseHeatAsMegaCredits,
      // Martian Lumber Corp
      canUsePlantsAsMegaCredits: this.canUsePlantsAsMegacredits,
      // Luna Trade Federation
      canUseTitaniumAsMegacredits: this.canUseTitaniumAsMegacredits,
      preservationProgram: this.preservationProgram,
      // This generation / this round
      actionsTakenThisRound: this.actionsTakenThisRound,
      availableActionsThisRound: this.availableActionsThisRound,
      actionsThisGeneration: Array.from(this.actionsThisGeneration),
      pendingInitialActions: this.pendingInitialActions.map(toName),
      // Cards
      dealtCorporationCards: this.dealtCorporationCards.map(toName),
      dealtProjectCards: this.dealtProjectCards.map(toName),
      cardsInHand: this.cardsInHand.map(toName),
      playedCards: this.playedCards.serialize(),
      draftedCards: this.draftedCards.map(toName),
      cardCost: this.cardCost,
      needsToDraft: this.needsToDraft,
      oceanBonus: this.oceanBonus,
      // Custom cards
      // Leavitt Station.
      scienceTagCount: this.tags.extraScienceTags,
      plantTagCount: this.tags.extraPlantTags,
      jovianTagCount: this.tags.extraJovianTags,
      // Ecoline
      plantsNeededForGreenery: this.plantsNeededForGreenery,
      // Lawsuit
      removingPlayers: this.removingPlayers,
      // Playwrights
      removedFromPlayCards: this.removedFromPlayCards.map(toName),
      // Standard Technology: Underworld
      standardProjectsThisGeneration: Array.from(
        this.standardProjectsThisGeneration,
      ),

      name: this.name,
      color: this.color,
      beginner: this.beginner,
      handicap: this.handicap,
      timer: this.timer.serialize(),
      // Stats
      actionsTakenThisGame: this.actionsTakenThisGame,
      victoryPointsByGeneration: this.victoryPointsByGeneration,
      draftHand: this.draftHand.map(toName),
      autoPass: this.autopass,
      globalParameterSteps: this.globalParameterSteps,
    };

    if (this.lastCardPlayed !== undefined) {
      result.lastCardPlayed = this.lastCardPlayed;
    }
    return result;
  }

  public static deserialize(d: SerializedPlayer): Player {
    const player = new Player(
      d.name,
      d.color,
      d.beginner,
      Number(d.handicap),
      d.id,
    );

    player.actionsTakenThisGame = d.actionsTakenThisGame;
    player.actionsThisGeneration = new Set(d.actionsThisGeneration);
    player.actionsTakenThisRound = d.actionsTakenThisRound;
    player.availableActionsThisRound = d.availableActionsThisRound ?? 2;
    player.canUseHeatAsMegaCredits = d.canUseHeatAsMegaCredits;
    player.canUsePlantsAsMegacredits = d.canUsePlantsAsMegaCredits;
    player.canUseTitaniumAsMegacredits = d.canUseTitaniumAsMegacredits;
    player.cardCost = d.cardCost;
    player.victoryPointsByGeneration = d.victoryPointsByGeneration;
    player.energy = d.energy;
    player.hasIncreasedTerraformRatingThisGeneration =
      d.hasIncreasedTerraformRatingThisGeneration;
    player.heat = d.heat;
    player.lastCardPlayed = d.lastCardPlayed;
    player.standardProjectsThisGeneration = new Set(
      d.standardProjectsThisGeneration,
    );
    player.megaCredits = d.megaCredits;
    player.needsToDraft = d.needsToDraft;
    player.oceanBonus = d.oceanBonus;
    player.plants = d.plants;
    player.plantsNeededForGreenery = d.plantsNeededForGreenery;
    player.production.override(
      Units.of({
        energy: d.energyProduction,
        heat: d.heatProduction,
        megacredits: d.megaCreditProduction,
        plants: d.plantProduction,
        steel: d.steelProduction,
        titanium: d.titaniumProduction,
      }),
    );
    player.removingPlayers = d.removingPlayers;
    player.tags.extraScienceTags = d.scienceTagCount;
    player.tags.extraPlantTags = d.plantTagCount;
    player.tags.extraJovianTags = d.jovianTagCount ?? 0;
    player.steel = d.steel;
    player.steelValue = d.steelValue;
    player.terraformRating = d.terraformRating;
    player.titanium = d.titanium;
    player.titaniumValue = d.titaniumValue;
    player.user = d.user;

    // Rebuild removed from play cards (Playwrights, Odyssey)
    player.removedFromPlayCards = cardsFromJSON(d.removedFromPlayCards);

    if (d.pickedCorporationCard !== undefined) {
      player.pickedCorporationCard = newCorporationCard(
        d.pickedCorporationCard,
      );
    }

    player.pendingInitialActions = corporationCardsFromJSON(
      d.pendingInitialActions ?? [],
    );
    player.dealtCorporationCards = corporationCardsFromJSON(
      d.dealtCorporationCards,
    );
    player.dealtProjectCards = cardsFromJSON(d.dealtProjectCards);
    player.cardsInHand = cardsFromJSON(d.cardsInHand);
    player.playedCards.deserialize(d.playedCards);
    player.draftedCards = cardsFromJSON(d.draftedCards);
    player.autopass = d.autoPass ?? false;
    player.preservationProgram = d.preservationProgram ?? false;

    player.timer = Timer.deserialize(d.timer);
    player.draftHand = cardsFromJSON(d.draftHand);
    if (d.globalParameterSteps) {
      player.globalParameterSteps = {
        ...DEFAULT_GLOBAL_PARAMETER_STEPS,
        ...d.globalParameterSteps,
      };
    }
    return player;
  }

  /* Shorthand for deferring things */
  public defer(
    input: PlayerInput | undefined | void | (() => PlayerInput | undefined),
    priority: Priority = Priority.DEFAULT,
  ): void {
    if (input === undefined) {
      return;
    }
    const cb = typeof input === 'function' ? input : () => input;
    const action = new SimpleDeferredAction(this, cb, priority);
    this.game.defer(action);
  }

  public runWhenEmpty(cb: () => void): () => void {
    const f = () => {
      if (this.game.deferredActions.length === 0) {
        cb();
        return;
      }
      this.game.deferredActions.runAll(() => f());
    };
    return f;
  }
}
