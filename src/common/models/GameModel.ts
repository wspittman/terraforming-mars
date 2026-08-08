import {GameOptionsModel} from './GameOptionsModel';
import {Color} from '../Color';
import {ClaimedMilestoneModel} from './ClaimedMilestoneModel';
import {FundedAwardModel} from './FundedAwardModel';
import {Phase} from '../Phase';
import {SpaceModel} from './SpaceModel';
import {SpectatorId} from '../Types';
import {GlobalParameter} from '../GlobalParameter';

// Common data about a game not assocaited with a player (eg the temperature.)
export type GameModel = {
  awards: ReadonlyArray<FundedAwardModel>;
  deckSize: number;
  discardPileSize: number;
  expectedPurgeTimeMs: number;
  experimentalReset?: boolean;
  gameAge: number;
  gameOptions: GameOptionsModel;
  generation: number;
  globalsPerGeneration: ReadonlyArray<Partial<Record<GlobalParameter, number>>>,
  isSoloModeWin: boolean;
  lastSoloGeneration: number,
  milestones: ReadonlyArray<ClaimedMilestoneModel>;
  name: string;
  oceans: number;
  oxygenLevel: number;
  passedPlayers: ReadonlyArray<Color>;
  phase: Phase;
  spaces: ReadonlyArray<SpaceModel>;
  spectatorId?: SpectatorId;
  step: number;
  temperature: number;
  isTerraformed: boolean;
  undoCount: number;
}
