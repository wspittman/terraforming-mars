import {BoardName} from '../boards/BoardName';
import {CardName} from '../cards/CardName';
import {Color} from '../Color';
import {RandomMAOptionType} from '../ma/RandomMAOptionType';
import {GameId, PlayerId} from '../Types';

export type BoardNameType = BoardName

export interface NewPlayerModel {
  name: string;
  color: Color;
  beginner: boolean;
  handicap: number;
}

export type EscapeVelocityOptions = {
  /** Time in minutes a player has to complete a game. */
  thresholdMinutes: number;
  /** Number of seconds a player gets back with every action. */
  bonusSectionsPerAction: number;
  /** Period in minutes after `escapeVelocityThreshold` after which player loses `escapeVelocityPenalty` VP. */
  penaltyPeriodMinutes: number;
  /** VP a player loses for every `escapeVelocityPeriod` minutes after `escapeVelocityThreshold`. */
  penaltyVPPerPeriod: number;
};

/**
 * Like GameOptions, but the data structure sent from the new game page.
 */
export interface NewGameConfig {
  player: NewPlayerModel;
  playerCount: number;
  corporateEra: boolean;
  board: BoardNameType;
  seed: number;
  randomFirstPlayer: boolean;

  // boardName: BoardName;
  clonedGamedId: GameId | undefined;

  // Configuration
  undoOption: boolean;
  showTimers: boolean;
  fastModeOption: boolean;
  showOtherPlayersVP: boolean;

  modularMA: boolean;

  // Variants
  draftVariant: boolean;
  initialDraft: boolean; // initialDraftVariant: boolean;
  startingCorporations: number;
  shuffleMapOption: boolean;
  randomMA: RandomMAOptionType;
  includeFanMA: boolean,
  soloTR: boolean; // Solo victory by getting TR 63 by game end
  customCorporations: Array<CardName>;
  bannedCards: Array<CardName>;
  includedCards: Array<CardName>;
  escapeVelocity: EscapeVelocityOptions | undefined;
}

export type NewGameResponse = {
  id: GameId;
  playerId: PlayerId;
};
