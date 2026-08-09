<template>
        <div id="create-game" class="create-game">
            <h1><span v-i18n>{{ constants.APP_NAME }}</span> — <span v-i18n>Create New Game</span></h1>
            <div class="changelog"><a :href="wikiUrls.changelog" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank"><u v-i18n>Read our changelog to get the latest updates.</u></a></div>
            <div class="discord-invite" v-if="playersCount===1">
              (<span v-i18n>Looking for people to play with</span>? <a :href="constants.DISCORD_INVITE" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank"><u v-i18n>Join us on Discord</u></a>.)
            </div>

            <div class="create-game-form create-game-panel create-game--block">

                <div class="create-game-options">
                    <div class="create-game-page-container">
                        <div class="create-game-page-column">
                            <h4 v-i18n>№ of Players</h4>
                            <div v-for="pCount in [1,2,3,4,5,6]" :key="pCount">
                              <input type="radio" :value="pCount" name="playersCount" v-model="playersCount" :id="pCount+'-radio'">
                              <label :for="pCount+'-radio'">
                                  {{ getPlayersCountText(pCount) }}
                              </label>
                            </div>
                        </div>

                        <div class="create-game-page-column">
                            <h4 v-i18n>Game Version</h4>

                            <input type="checkbox" name="corporateEra" id="corporateEra-checkbox" v-model="expansions.corpera">
                            <label for="corporateEra-checkbox" class="expansion-button">
                                <div class="create-game-expansion-icon expansion-icon-CE"></div>
                                <span v-i18n>Corporate Era</span>
                            </label>
                        </div>

                        <div class="create-game-page-column">
                            <h4 v-i18n>Board</h4>

                            <div v-for="boardName in boards" :key="boardName">
                              <div v-if="boardName==='utopia planitia'" class="create-game-subsection-label" v-i18n>Fan-made</div>
                              <input type="radio" :value="boardName" name="board" v-model="board" :id="boardName+'-checkbox'">
                              <label :for="boardName+'-checkbox'" class="expansion-button">
                                  <span :class="getBoardColorClass(boardName)">&#x2B22;</span>
                                  <span class="capitalized" v-i18n>{{ boardName }}</span>
                                  <template v-if="boardName !== RandomBoardOption.OFFICIAL && boardName !== RandomBoardOption.ALL">
                                    &nbsp;<a :href="boardHref(boardName)" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                                  </template>
                              </label>
                            </div>
                        </div>

                        <div class="create-game-page-column">
                            <h4 v-i18n>Options</h4>

                            <label for="startingCorpNum-checkbox">
                            <input type="number" class="create-game-corporations-count" value="2" min="1" :max="6" v-model="startingCorporations" id="startingCorpNum-checkbox">
                                <span v-i18n>Starting Corporations</span>
                            </label>

                            <template v-if="playersCount === 1">
                            <input type="checkbox" v-model="soloTR" id="soloTR-checkbox">
                            <label for="soloTR-checkbox">
                                <span v-i18n>63 TR solo mode</span>&nbsp;<a :href="wikiUrls.trSoloMode" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>
                            </template>

                            <!-- <input type="checkbox" v-model="beginnerOption" id="beginnerOption-checkbox">
                            <label for="beginnerOption-checkbox">
                                <span v-i18n>Beginner Options</span>
                            </label> -->

                            <input type="checkbox" v-model="undoOption" id="undo-checkbox">
                            <label for="undo-checkbox">
                                <span v-i18n>Allow undo</span>&nbsp;<a :href="wikiUrls.allowUndo" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>
                            <div v-if="undoOption">
                              <span v-i18n>Undo is now in best effort support.</span>
                              <a href="https://github.com/terraforming-mars/terraforming-mars/discussions/7647" target="_blank">&#9432;</a>
                              <br>
                              <span v-i18n>No effort will be spent to fix it.</span>
                            </div>
                            <input type="checkbox" v-model="showTimers" id="timer-checkbox">
                            <label for="timer-checkbox">
                                <span v-i18n>Show timers</span>
                            </label>

                            <input type="checkbox" v-model="escapeVelocityMode" id="escapevelocity-checkbox">
                            <label for="escapevelocity-checkbox">
                                <div class="create-game-expansion-icon expansion-icon-escape-velocity"></div>
                                <span v-i18n>Escape Velocity</span>&nbsp;<a :href="wikiUrls.escapeVelocity" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>

                            <label for="escapeThreshold-checkbox" v-show="escapeVelocityMode">
                              <span v-i18n>After</span><span>&nbsp;</span>
                              <input type="number" class="create-game-corporations-count" value="30" step="5" min="0" :max="180" v-model="escapeVelocityThreshold" id="escapeThreshold-checkbox">
                              <span v-i18n>min</span>
                            </label>

                            <label for="escapeBonusSeconds-checkbox" v-show="escapeVelocityMode">
                              <span v-i18n>Plus</span><span>&nbsp;</span>
                              <input type="number" class="create-game-corporations-count" value="2" step="1" min="1" :max="10" v-model="escapeVelocityBonusSeconds" id="escapeBonusSeconds-checkbox">
                              <span v-i18n>seconds per action</span>
                            </label>

                            <label for="escapePeriod-checkbox" v-show="escapeVelocityMode">
                              <span v-i18n>Reduce</span><span>&nbsp;</span>
                              <input type="number" class="create-game-corporations-count" value="1" min="1" :max="10" v-model="escapeVelocityPenalty" id="escapePeriod-checkbox">
                              <span v-i18n>VP every</span><span>&nbsp;</span>
                              <input type="number" class="create-game-corporations-count" value="2" min="1" :max="10" v-model="escapeVelocityPeriod" id="escapePeriod-checkbox">
                              <span v-i18n>min</span>
                            </label>

                            <input type="checkbox" v-model="shuffleMapOption" id="shuffleMap-checkbox">
                            <label for="shuffleMap-checkbox">
                                    <span v-i18n>Randomize board tiles</span>&nbsp;<a :href="wikiUrls.randomizeBoardTiles" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>

                            <input type="checkbox" v-model="seededGame" id="seeded-checkbox">
                            <label for="seeded-checkbox">
                                <span v-i18n>Set Predefined Game</span>&nbsp;<a :href="wikiUrls.setPredefinedGame" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>

                            <div v-if="seededGame">
                                <input type="text" name="clonedGamedId" v-model="clonedGameId" >
                            </div>

                            <div class="create-game-subsection-label" v-i18n>Filter</div>

                            <input type="checkbox" v-model="showCorporationList" id="customCorps-checkbox">
                            <label for="customCorps-checkbox">
                                <span v-i18n>Custom Corporation list</span>
                                <span v-if="customCorporations.length">&nbsp;({{ customCorporations.length }})</span>
                            </label>

                            <input type="checkbox" v-model="showBannedCards" id="bannedCards-checkbox">
                            <label for="bannedCards-checkbox">
                                <span v-i18n>Exclude some cards</span>
                            </label>

                            <input type="checkbox" v-model="showIncludedCards" id="includedCards-checkbox">
                            <label for="includedCards-checkbox">
                                <span v-i18n>Include some cards</span>
                            </label>


                        </div>

                        <div class="create-game-page-column" v-if="playersCount > 1">
                            <h4 v-i18n>Multiplayer Options</h4>

                            <div class="create-game-page-column-row">
                                <div>
                                <input type="checkbox" name="draftVariant" v-model="draftVariant" id="draft-checkbox">
                                <label for="draft-checkbox">
                                    <span v-i18n>Draft variant</span>
                                </label>
                                </div>

                                <div>
                                <input type="checkbox" name="initialDraft" v-model="initialDraft" id="initialDraft-checkbox">
                                <label for="initialDraft-checkbox">
                                    <span v-i18n>Initial Draft variant</span>&nbsp;<a :href="wikiUrls.initialDraft" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                                </label>
                                </div>
                            </div>
                            <input type="checkbox" v-model="randomFirstPlayer" id="randomFirstPlayer-checkbox">
                            <label for="randomFirstPlayer-checkbox">
                                <span v-i18n>Random first player</span>
                            </label>

                            <input type="checkbox" name="randomMAToggle" id="randomMA-checkbox" @change="randomMAToggle()">
                            <label for="randomMA-checkbox">
                                <span v-i18n>Random Milestones/Awards</span>&nbsp;<a :href="wikiUrls.randomMilestonesAndAwards" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>

                            <div class="create-game-page-column-row" v-if="isRandomMAEnabled()">
                                <div>
                                <input type="radio" name="randomMAOption" v-model="randomMA" :value="getRandomMaOptionType('limited')" id="limitedRandomMA-radio">
                                <label class="label-randomMAOption" for="limitedRandomMA-radio">
                                    <span v-i18n>{{ getRandomMaOptionType('limited') }}</span>
                                </label>
                                </div>

                                <div>
                                <input type="radio" name="randomMAOption" v-model="randomMA" :value="getRandomMaOptionType('full')" id="unlimitedRandomMA-radio">
                                <label class="label-randomMAOption" for="unlimitedRandomMA-radio">
                                    <span v-i18n>{{ getRandomMaOptionType('full') }}</span>
                                </label>
                                </div>
                                <div>
                                  <input type="checkbox" name="modularMA" v-model="modularMA" id="modularMA-checkbox">
                                   <label for="modularMA-checkbox">
                                    <span v-i18n>Official Random α</span>
                                  </label>
                                </div>
                            </div>

                            <div v-if="modularMA">
                              The new Milestones and Awards are still in active development.<br>
                              Please don't report anything unless it breaks the game.<br>
                              These are <b>always fully random</b>.
                            </div>
                            <template v-if="randomMA !== RandomMAOptionType.NONE">
                              <input type="checkbox" v-model="includeFanMA" id="fanMA-checkbox">
                              <label for="fanMA-checkbox">
                                  <span v-i18n>Include fan Milestones/Awards</span>
                              </label>
                            </template>

                            <input type="checkbox" name="showOtherPlayersVP" v-model="showOtherPlayersVP" id="realTimeVP-checkbox">
                            <label for="realTimeVP-checkbox">
                                <span v-i18n>Show real-time VP</span>&nbsp;<a :href="wikiUrls.showRealtimeVP" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>

                            <input type="checkbox" v-model="fastModeOption" id="fastMode-checkbox">
                            <label for="fastMode-checkbox">
                                <span v-i18n>Fast mode</span>&nbsp;<a :href="wikiUrls.fastMode" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>
                        </div>

                        <div class="create-game-players-cont">
                            <div class="container">
                                <div class="columns">
                                  <template v-for="(newPlayer, index) in getPlayers()" :key="index">
                                    <div>
                                      <div :class="'form-group col6 create-game-player '+getPlayerContainerColorClass(newPlayer.color)">
                                          <div>
                                              <input class="form-input form-inline create-game-player-name" :placeholder="getPlayerNamePlaceholder(index)" v-model="newPlayer.name" >
                                          </div>
                                          <div class="create-game-page-color-row">
                                              <template v-for="color in PLAYER_COLORS" :key="color">
                                                <div>
                                                  <input type="radio" :value="color" :name="'playerColor' + (index + 1)" v-model="newPlayer.color" :id="'radioBox' + color + (index + 1)">
                                                  <label :for="'radioBox' + color + (index + 1)">
                                                      <div :class="'create-game-colorbox '+getPlayerCubeColorClass(color)"></div>
                                                  </label>
                                                </div>
                                              </template>
                                          </div>
                                          <div>
                                              <!-- <template v-if="beginnerOption"> -->
                                                  <label v-if="isBeginnerToggleEnabled()" class="form-switch form-inline create-game-beginner-option-label">
                                                      <input type="checkbox" v-model="newPlayer.beginner">
                                                      <i class="form-icon"></i> <span v-i18n>Beginner?</span>&nbsp;<a :href="wikiUrls.beginnerCorporation" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                                                  </label>

                                                  <label class="form-label">
                                                      <input type="number" class="form-input form-inline player-handicap" value="0" min="0" :max="10" v-model.number="newPlayer.handicap" >
                                                      <i class="form-icon"></i><span v-i18n>TR Boost</span>&nbsp;<a :href="wikiUrls.trBoost" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                                                  </label>
                                              <!-- </template> -->

                                              <label class="form-radio form-inline" v-if="!randomFirstPlayer">
                                                  <input type="radio" name="firstIndex" :value="index + 1" v-model="firstIndex">
                                                  <i class="form-icon"></i> <span v-i18n>Goes First?</span>
                                              </label>
                                          </div>
                                      </div>
                                    </div>
                                  </template>
                                </div>
                            </div>
                        </div>

                        <div class="create-game-action">
                            <AppButton title="Create game" size="big" @click="createGame"/>
                            <AppButton title="Reset" size="big" @click="resetSettings"/>

                            <label>
                                <div class="btn btn-primary btn-action btn-lg"><i class="icon icon-upload"></i></div>
                                <input style="display: none" type="file" accept=".json" id="settings-file" ref="file" @change="uploadSettings()">
                            </label>

                            <label>
                                <div @click="downloadSettings()" class="btn btn-primary btn-action btn-lg"><i class="icon icon-download"></i></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>


            <CorporationsFilter
                ref="corporationsFilter"
                v-show="showCorporationList"
                v-if="showCorporationList"
                @corporation-list-changed="updateCustomCorporations"
                :expansions="expansions"
                :selected="customCorporations"
                @close="showCorporationList = false"
            />

            <div class="create-game--block" v-if="showBannedCards">
              <CardsFilter
                  ref="cardsFilter"
                  @cards-list-changed="updateBannedCards"
                  :title="'Cards to exclude from the game'"
                  :hint="'Start typing the card name to exclude'"
              />
            </div>

            <div class="create-game--block" v-if="showIncludedCards">
              <CardsFilter
                  ref="cardsFilter2"
                  @cards-list-changed="updateIncludedCards"
                  :title="'Cards to include in the game'"
                  :hint="'Start typing the card name to include'"
              />
            </div>
          <PreferencesIcon/>
        </div>
</template>

<script lang="ts">
import * as constants from '@/common/constants';

import {defineComponent, nextTick} from 'vue';
import {Color, PLAYER_COLORS} from '@/common/Color';
import {BoardName} from '@/common/boards/BoardName';
import {RandomBoardOption} from '@/common/boards/RandomBoardOption';
import {CardName} from '@/common/cards/CardName';
import CorporationsFilter from '@/client/components/create/CorporationsFilter.vue';
import {translateText, translateTextWithParams} from '@/client/directives/i18n';
import CardsFilter from '@/client/components/create/CardsFilter.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {playerColorClass} from '@/common/utils/utils';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {GameId, JSONObject} from '@/common/Types';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import {BoardNameType, NewGameConfig, NewPlayerModel} from '@/common/game/NewGameConfig';
import {vueRoot} from '@/client/components/vueRoot';
import {CreateGameModel} from './CreateGameModel';
import {paths} from '@/common/app/paths';
import {JSONProcessor} from './JSONProcessor';
import {defaultCreateGameModel} from './defaultCreateGameModel';
import {CreateGameSettingsStorage} from './CreateGameSettingsStorage';
import {RULEBOOK_URLS, WIKI, WIKI_URLS} from '@/client/utils/WikiLinks';
import {setDocumentTitle} from '@/client/utils/documentTitle';

const createGameSettingsStorage = new CreateGameSettingsStorage();


type Refs = {
  file: HTMLInputElement;
  cardsFilter: InstanceType<typeof CardsFilter>;
  cardsFilter2: InstanceType<typeof CardsFilter>;
};

type FormModel = {
  uploading: boolean;
};

export default defineComponent({
  name: 'CreateGameForm',
  data(): CreateGameModel & FormModel {
    return {
      ...defaultCreateGameModel(),
      uploading: false,
    };
  },
  components: {
    AppButton,
    CardsFilter,
    CorporationsFilter,
    PreferencesIcon,
  },
  watch: {
    playersCount(value: number) {
      if (value === 1) {
        this.expansions.corpera = true;
      }
    },
  },
  mounted() {
    setDocumentTitle('Create New Game');
    this.restoreLastSettings();
  },
  computed: {
    wikiUrls(): typeof RULEBOOK_URLS & typeof WIKI_URLS {
      return {...RULEBOOK_URLS, ...WIKI_URLS};
    },
    typedRefs(): Refs {
      return this.$refs as Refs;
    },
    RandomBoardOption(): typeof RandomBoardOption {
      return RandomBoardOption;
    },
    RandomMAOptionType(): typeof RandomMAOptionType {
      return RandomMAOptionType;
    },
    constants(): typeof constants {
      return constants;
    },
    PLAYER_COLORS(): typeof PLAYER_COLORS {
      return PLAYER_COLORS;
    },
    boards() {
      return [
        BoardName.THARSIS,
        BoardName.HELLAS,
        BoardName.ELYSIUM,
        RandomBoardOption.OFFICIAL,
        BoardName.UTOPIA_PLANITIA,
        BoardName.VASTITAS_BOREALIS_NOVA,
        BoardName.ARABIA_TERRA,
        BoardName.VASTITAS_BOREALIS,
        BoardName.HOLLANDIA,
        RandomBoardOption.ALL,
      ];
    },
  },
  methods: {
    restoreLastSettings() {
      const settings = createGameSettingsStorage.loadSettings();
      if (settings === undefined) {
        return;
      }
      try {
        const processor = this.applySettings(settings);
        if (processor.warnings.length > 0) {
          this.showSettingsLoadResult('Restore settings', processor);
        }
      } catch (e) {
        // TODO(rusliksu): show the restore error in the UI instead of logging only to the console.
        console.warn('Could not restore create game settings:', e);
      }
    },
    applySettings(json: JSONObject): JSONProcessor {
      const component: CreateGameModel = this;
      const refs = this.typedRefs;
      const processor = new JSONProcessor(component);
      this.uploading = true;
      try {
        processor.applyJSON(json);
      } catch (e) {
        this.uploading = false;
        throw e;
      }
      nextTick(() => {
        try {
          if (component.showBannedCards && refs.cardsFilter) {
            refs.cardsFilter.selected = processor.bannedCards;
          }
          if (component.showIncludedCards && refs.cardsFilter2) {
            refs.cardsFilter2.selected = processor.includedCards;
          }
          if (!component.seededGame) {
            component.seed = Math.random();
          }
        } finally {
          this.uploading = false;
        }
      });
      return processor;
    },
    showSettingsLoadResult(title: string, processor: JSONProcessor) {
      const root = vueRoot(this);
      if (processor.warnings.length > 0) {
        root.showAlert(title, 'Settings loaded with these warnings: \n' + processor.warnings.join('\n'));
      } else {
        root.showAlert(title, 'Settings loaded.');
      }
    },
    resetSettings() {
      createGameSettingsStorage.clearSettings();
      Object.assign(this, defaultCreateGameModel(), {
        uploading: false,
      });
      nextTick(() => {
        const refs = this.typedRefs;
        if (refs.cardsFilter) {
          refs.cardsFilter.selected = [];
        }
        if (refs.cardsFilter2) {
          refs.cardsFilter2.selected = [];
        }
      });
    },
    async downloadSettings() {
      const serializedData = await this.serializeSettings();

      if (serializedData) {
        const a = document.createElement('a');
        const blob = new Blob([serializedData], {'type': 'application/json'});
        a.href = window.URL.createObjectURL(blob);
        a.download = 'tm_settings.json';
        a.click();
      }
    },
    uploadSettings() {
      const refs = this.typedRefs;
      const file = refs.file.files !== null ? refs.file.files[0] : undefined;
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        try {
          const readerResults = reader.result;
          if (typeof(readerResults) === 'string') {
            const processor = this.applySettings(JSON.parse(readerResults));
            this.showSettingsLoadResult('Upload settings', processor);
          }
        } catch (e) {
          const root = vueRoot(this);
          root.showAlert('Upload settings', 'Error loading settings ' + e);
        }
      }, false);
      if (file) {
        if (/\.json$/i.test(file.name)) {
          reader.readAsText(file);
        }
      }
    },
    getPlayerNamePlaceholder(index: number): string {
      return translateTextWithParams('Player ${0} name', [String(index + 1)]);
    },
    updateCustomCorporations(customCorporations: Array<CardName>) {
      this.customCorporations = customCorporations;
    },
    updateBannedCards(bannedCards: Array<CardName>) {
      this.bannedCards = bannedCards;
    },
    updateIncludedCards(includedCards: Array<CardName>) {
      this.includedCards = includedCards;
    },
    getPlayers(): Array<NewPlayerModel> {
      return this.players.slice(0, this.playersCount);
    },
    isRandomMAEnabled(): Boolean {
      return this.randomMA !== RandomMAOptionType.NONE;
    },
    randomMAToggle() {
      if (this.randomMA === RandomMAOptionType.NONE) {
        this.randomMA = RandomMAOptionType.LIMITED;
      } else {
        this.randomMA = RandomMAOptionType.NONE;
      }
    },
    getRandomMaOptionType(type: 'limited' | 'full'): RandomMAOptionType {
      if (type === 'limited') {
        return RandomMAOptionType.LIMITED;
      } else if (type === 'full') {
        return RandomMAOptionType.UNLIMITED;
      } else {
        return RandomMAOptionType.NONE;
      }
    },
    isBeginnerToggleEnabled(): Boolean {
      return !this.initialDraft;
    },
    getPlayersCountText(count: number): string {
      if (count === 1) {
        return translateText('Solo');
      }
      return count.toString();
    },
    getBoardColorClass(boardName: BoardName | BoardNameType): string {
      switch (boardName) {
      case BoardName.THARSIS:
        return 'create-game-board-hexagon create-game-tharsis';
      case BoardName.HELLAS:
        return 'create-game-board-hexagon create-game-hellas';
      case BoardName.ELYSIUM:
        return 'create-game-board-hexagon create-game-elysium';
      case BoardName.UTOPIA_PLANITIA:
        return 'create-game-board-hexagon create-game-utopia-planitia';
      case BoardName.VASTITAS_BOREALIS_NOVA:
        return 'create-game-board-hexagon create-game-vastitas-borealis-nova';
      case BoardName.ARABIA_TERRA:
        return 'create-game-board-hexagon create-game-arabia-terra';
      case BoardName.VASTITAS_BOREALIS:
        return 'create-game-board-hexagon create-game-vastitas-borealis';
      case BoardName.HOLLANDIA:
        return 'create-game-board-hexagon create-game-hollandia';
      default:
        return 'create-game-board-hexagon create-game-random';
      }
    },
    getPlayerCubeColorClass(color: Color): string {
      return playerColorClass(color, 'bg');
    },
    getPlayerContainerColorClass(color: Color): string {
      return playerColorClass(color, 'bg_transparent');
    },
    boardHref(boardName: BoardName | RandomBoardOption) {
      const options: Record<BoardName | RandomBoardOption, string> = {
        [BoardName.THARSIS]: 'tharsis',
        [BoardName.HELLAS]: 'hellas',
        [BoardName.ELYSIUM]: 'elysium',
        [BoardName.ARABIA_TERRA]: 'arabia-terra',
        [BoardName.UTOPIA_PLANITIA]: 'utopia-planitia',
        [BoardName.VASTITAS_BOREALIS_NOVA]: 'vastitas-borealis-nova',
        [BoardName.VASTITAS_BOREALIS]: 'vastitas-borealis',
        [BoardName.HOLLANDIA]: 'hollandia',
        [RandomBoardOption.OFFICIAL]: '',
        [RandomBoardOption.ALL]: '',
      };
      return `${WIKI}/Maps#${options[boardName]}`;
    },
    async serializeSettings() {
      let players = this.players.slice(0, this.playersCount);

      if (this.randomFirstPlayer) {
        // Shuffle players array to assign each player a random seat around the table
        players = players.map((a) => ({sort: Math.random(), value: a}))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);
        this.firstIndex = Math.floor(this.seed * this.playersCount) + 1;
      }

      // Auto assign an available color if there are duplicates
      const uniqueColors = new Set(players.map((player) => player.color));
      if (uniqueColors.size !== players.length) {
        const usedColors: Set<Color> = new Set();
        // This filter retains the default player color order.
        const unusedColors = PLAYER_COLORS.filter((c) => !uniqueColors.has(c));
        for (const player of players) {
          const color = player.color;
          if (usedColors.has(color)) {
            // Pulling off the front of the list also helps retain the default player color order.
            player.color = unusedColors.shift() as Color;
            usedColors.add(color);
          } else {
            usedColors.add(color);
          }
        }
      }

      // Set player name automatically if not entered
      const isSoloMode = this.playersCount === 1;

      this.players.forEach((player) => {
        if (player.name === '') {
          if (isSoloMode) {
            player.name = this.$t('You');
          } else {
            const defaultPlayerName = this.$t(player.color.charAt(0).toUpperCase() + player.color.slice(1));
            player.name = defaultPlayerName;
          }
        }
      });

      players.map((player: any) => {
        player.first = (this.firstIndex === player.index);
        return player;
      });

      const draftVariant = this.draftVariant;
      const initialDraft = this.initialDraft;
      const randomMA = this.randomMA;
      const showOtherPlayersVP = this.showOtherPlayersVP;
      const shuffleMapOption = this.shuffleMapOption;
      const customCorporations = this.customCorporations;
      const bannedCards = this.bannedCards;
      const includedCards = this.includedCards;
      const board = this.board;
      const seed = this.seed;
      const undoOption = this.undoOption;
      const showTimers = this.showTimers;
      const fastModeOption = this.fastModeOption;
      const includeFanMA = this.includeFanMA;
      const startingCorporations = this.startingCorporations;
      const soloTR = this.soloTR;
      const randomFirstPlayer = this.randomFirstPlayer;
      let clonedGamedId: undefined | GameId = undefined;

      if (players.length === 1 && this.expansions.corpera === false) {
        const confirm = window.confirm(translateText(
          'We do not recommend playing a solo game without the Corporate Era. Press OK if you want to play without it.'));
        if (confirm === false) {
          return;
        }
      }

      // Check custom corp count
      if (customCorporations.length > 0) {
        const neededCorpsCount = players.length * startingCorporations;
        if (customCorporations.length < neededCorpsCount) {
          window.alert(translateTextWithParams('Must select at least ${0} corporations', [neededCorpsCount.toString()]));
          return;
        }
      } else {
        customCorporations.length = 0;
      }

      // Clone game checks
      if (this.clonedGameId !== undefined && this.seededGame) {
        const gameData = await fetch(paths.API_CLONEABLEGAME + '?id=' + this.clonedGameId)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            if (response.status === 404) {
              return;
            }
            return response.text().then((res) => new Error(res));
          });
        if (gameData === undefined) {
          alert(this.$t('Game id ' + this.clonedGameId + ' not found'));
          return;
        }
        if (gameData instanceof Error) {
          alert(this.$t('Error looking for predefined game ' + gameData.message));
          return;
        }
        clonedGamedId = this.clonedGameId;
        if (gameData.playerCount !== players.length) {
          alert(this.$t('Player count mismatch'));
          this.playersCount = gameData.playerCount;
          return;
        }
      } else if (!this.seededGame) {
        clonedGamedId = undefined;
      }

      const dataToSend: NewGameConfig = {
        players,
        corporateEra: this.expansions.corpera,
        draftVariant,
        showOtherPlayersVP,
        customCorporationsList: customCorporations,
        bannedCards,
        includedCards,
        board,
        seed,
        undoOption,
        showTimers,
        fastModeOption,
        includeFanMA,
        modularMA: this.modularMA,
        startingCorporations,
        soloTR,
        clonedGamedId,
        initialDraft,
        randomMA,
        shuffleMapOption,
        // beginnerOption,
        randomFirstPlayer,
        escapeVelocity: this.escapeVelocityMode ?
          {
            thresholdMinutes: this.escapeVelocityThreshold,
            bonusSectionsPerAction: this.escapeVelocityBonusSeconds,
            penaltyPeriodMinutes: this.escapeVelocityPeriod,
            penaltyVPPerPeriod: this.escapeVelocityPenalty,
          } : undefined,
      };
      return JSON.stringify(dataToSend, undefined, 4);
    },
    async createGame() {
      const dataToSend = await this.serializeSettings();

      if (dataToSend === undefined) {
        return;
      }
      createGameSettingsStorage.saveSettings(JSON.parse(dataToSend) as JSONObject);
      const onSuccess = (json: any) => {
        if (json.players.length === 1) {
          window.location.href = 'player?id=' + json.players[0].id;
          return;
        } else {
          window.history.replaceState(json, `${constants.APP_NAME} - Game`, 'game?id=' + json.id);
          vueRoot(this).game = json;
          vueRoot(this).screen = 'game-home';
        }
      };

      fetch(paths.API_CREATEGAME, {'method': 'POST', 'body': dataToSend, 'headers': {'Content-Type': 'application/json'}})
        .then((response) => response.text())
        .then((text) => {
          try {
            const json = JSON.parse(text);
            onSuccess(json);
          } catch (err) {
            throw new Error(text);
          }
        })
        .catch((error: Error) => {
          alert(error.message);
        });
    },
  },
});

</script>
