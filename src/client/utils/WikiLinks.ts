import {GameModule} from '@/common/cards/GameModule';

export const WIKI = 'https://github.com/terraforming-mars/terraforming-mars/wiki';

export const RULEBOOK_URLS: Record<GameModule, string> = {
  base: `${WIKI}/Rulebooks`,
  corpera: `${WIKI}/Rulebooks`,
};

export const WIKI_URLS = {
  changelog: `${WIKI}/Changelog`,
  escapeVelocity: `${WIKI}/Escape-Velocity`,
  trSoloMode: `${WIKI}/Variants#tr-solo-mode`,
  allowUndo: `${WIKI}/Variants#allow-undo`,
  randomizeBoardTiles: `${WIKI}/Variants#randomize-board-tiles`,
  setPredefinedGame: `${WIKI}/Variants#set-predefined-game`,
  initialDraft: `${WIKI}/Variants#initial-draft`,
  randomMilestonesAndAwards: `${WIKI}/Variants#random-milestones-and-awards`,
  showRealtimeVP: `${WIKI}/Variants#show-real-time-vp`,
  fastMode: `${WIKI}/Variants#fast-mode`,
  beginnerCorporation: `${WIKI}/Variants#beginner-corporation`,
  trBoost: `${WIKI}/Variants#tr-boost`,
} as const;
