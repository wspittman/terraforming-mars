import {Phase} from '../common/Phase';
import {SerializedClaimedMilestone} from './milestones/ClaimedMilestone';
import {SerializedFundedAward} from './awards/FundedAward';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SerializedPlayer} from './SerializedPlayer';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {GameOptions} from './game/GameOptions';
import {LogMessage} from '../common/logs/LogMessage';
import {SerializedBoard} from './boards/SerializedBoard';
import {SerializedDeck} from './cards/SerializedDeck';
import {AwardName} from '../common/ma/AwardName';
import {GlobalParameter} from '../common/GlobalParameter';
import {MilestoneName} from '../common/ma/MilestoneName';

export type SerializedGameOptions = Pick<GameOptions,
  'bannedCards' |
  'boardName' |
  'corporateEra' |
  'customCorporationsList' |
  'draftVariant' |
  'escapeVelocity' |
  'fastModeOption' |
  'includeFanMA' |
  'includedCards' |
  'initialDraftVariant' |
  'modularMA' |
  'randomMA' |
  'showOtherPlayersVP' |
  'showTimers' |
  'shuffleMapOption' |
  'soloTR' |
  'startingCorporations' |
  'twoCorpsVariant' |
  'undoOption'>;

export type SerializedGame = {
    activePlayer: PlayerId;
    awards: Array<AwardName>;
    board: SerializedBoard;
    currentSeed: number;
    claimedMilestones: Array<SerializedClaimedMilestone>;
    clonedGamedId?: string;
    corporationDeck: SerializedDeck,
    createdTimeMs: number;
    deferredActions: Array<DeferredAction>;
    donePlayers: Array<PlayerId>;
    draftRound: number;
    first: PlayerId;
    fundedAwards: Array<SerializedFundedAward>;
    gameAge: number;
    gameLog: Array<LogMessage>;
    gameOptions: SerializedGameOptions;
    generation: number;
    globalsPerGeneration: Array<Partial<Record<GlobalParameter, number>>>;
    id: GameId;
    initialDraftIteration: number;
    lastSaveId: number;
    milestones: Array<MilestoneName>;
    name: string;
    oxygenLevel: number;
    passedPlayers: Array<PlayerId>;
    phase: Phase;
    players: Array<SerializedPlayer>;
    projectDeck: SerializedDeck,
    researchedPlayers: Array<PlayerId>;
    seed: number;
    someoneHasRemovedOtherPlayersPlants: boolean;
    spectatorId: SpectatorId;
    temperature: number;
    undoCount: number;
}
