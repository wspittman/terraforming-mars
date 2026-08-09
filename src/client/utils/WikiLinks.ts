import {GameModule} from '@/common/cards/GameModule';

export const WIKI = 'https://github.com/terraforming-mars/terraforming-mars/wiki';

export const RULEBOOK_URLS: Record<GameModule, string> = {
  base: `${WIKI}/Rulebooks`,
  corpera: `${WIKI}/Rulebooks`,
};

export const WIKI_URLS = {
  changelog: `${WIKI}/Changelog`,
  trSoloMode: `${WIKI}/Variants#tr-solo-mode`,
  allowUndo: `${WIKI}/Variants#allow-undo`,
  setPredefinedGame: `${WIKI}/Variants#set-predefined-game`,
  initialDraft: `${WIKI}/Variants#initial-draft`,
  showRealtimeVP: `${WIKI}/Variants#show-real-time-vp`,
  beginnerCorporation: `${WIKI}/Variants#beginner-corporation`,
} as const;
