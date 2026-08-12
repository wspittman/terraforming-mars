<template>
        <div id="create-game" class="create-game">
            <div class="create-game-header">
              <h1><span v-i18n>{{ constants.APP_NAME }}</span> — <span v-i18n>Create New Game</span></h1>
              <a class="create-game-cards-link" href="/cards" v-i18n>Cards encyclopedia</a>
            </div>

            <div class="create-game-form create-game-panel create-game--block">

                <div class="create-game-options">
                    <div class="create-game-page-container">
                        <div class="create-game-page-column">
                            <h4 v-i18n>Players</h4>
                            <div v-for="pCount in [1,2,3,4,5,6]" :key="pCount">
                              <input type="radio" :value="pCount" name="playersCount" v-model="playersCount" :id="pCount+'-radio'">
                              <label :for="pCount+'-radio'">
                                  {{ getPlayersCountText(pCount) }}
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

                            <input type="checkbox" v-model="randomFirstPlayer" id="randomFirstPlayer-checkbox">
                            <label for="randomFirstPlayer-checkbox">
                                <span v-i18n>Random first player</span>
                            </label>

                            <input type="checkbox" name="showOtherPlayersVP" v-model="showOtherPlayersVP" id="realTimeVP-checkbox">
                            <label for="realTimeVP-checkbox">
                                <span v-i18n>Show real-time VP</span>&nbsp;<a :href="wikiUrls.showRealtimeVP" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
                            </label>

                        </div>

                        <div class="create-game-players-cont">
                            <div class="container">
                                <div class="columns">
                                  <template v-for="(newPlayer, index) in [player]" :key="index">
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
import {CardName} from '@/common/cards/CardName';
import CorporationsFilter from '@/client/components/create/CorporationsFilter.vue';
import {translateText, translateTextWithParams} from '@/client/directives/i18n';
import CardsFilter from '@/client/components/create/CardsFilter.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {playerColorClass} from '@/common/utils/utils';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {GameId, JSONObject} from '@/common/Types';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import {vueRoot} from '@/client/components/vueRoot';
import {CreateGameModel} from './CreateGameModel';
import {paths} from '@/common/app/paths';
import {JSONProcessor} from './JSONProcessor';
import {defaultCreateGameModel} from './defaultCreateGameModel';
import {CreateGameSettingsStorage} from './CreateGameSettingsStorage';
import {setDocumentTitle} from '@/client/utils/documentTitle';
import {NewGameConfig, NewGameResponse} from '@/common/game/NewGameConfig';
import {RULEBOOK_URLS, WIKI_URLS} from '@/client/utils/WikiLinks';

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
    constants(): typeof constants {
      return constants;
    },
    PLAYER_COLORS(): typeof PLAYER_COLORS {
      return PLAYER_COLORS;
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
    getPlayersCountText(count: number): string {
      if (count === 1) {
        return translateText('Solo');
      }
      const botLabel = count === 2 ? 'bot' : 'bots';
      return translateTextWithParams('${0} human + ${1} ${2}', ['1', String(count - 1), botLabel]);
    },
    getPlayerCubeColorClass(color: Color): string {
      return playerColorClass(color, 'bg');
    },
    getPlayerContainerColorClass(color: Color): string {
      return playerColorClass(color, 'bg_transparent');
    },
    async serializeSettings() {
      const player = this.player;
      if (player.name === '') {
        player.name = this.$t('You');
      }

      const showOtherPlayersVP = this.showOtherPlayersVP;
      const customCorporations = this.customCorporations;
      const bannedCards = this.bannedCards;
      const includedCards = this.includedCards;
      const board = this.board;
      const seed = this.seed;
      const undoOption = this.undoOption;
      const showTimers = this.showTimers;
      const startingCorporations = this.startingCorporations;
      const soloTR = this.soloTR;
      const randomFirstPlayer = this.randomFirstPlayer;
      let clonedGamedId: undefined | GameId = undefined;

      // Check custom corp count
      if (customCorporations.length > 0) {
        const neededCorpsCount = this.playersCount * startingCorporations;
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
        if (gameData.playerCount !== this.playersCount) {
          alert(this.$t('Player count mismatch'));
          this.playersCount = gameData.playerCount;
          return;
        }
      } else if (!this.seededGame) {
        clonedGamedId = undefined;
      }

      const dataToSend: NewGameConfig = {
        player,
        playerCount: this.playersCount,
        corporateEra: true,
        showOtherPlayersVP,
        customCorporations,
        bannedCards,
        includedCards,
        board,
        seed,
        undoOption,
        showTimers,
        fastModeOption: false,
        includeFanMA: false,
        modularMA: false,
        startingCorporations,
        soloTR,
        clonedGamedId,
        randomMA: RandomMAOptionType.NONE,
        shuffleMapOption: false,
        // beginnerOption,
        randomFirstPlayer,
        escapeVelocity: undefined,
      };
      return JSON.stringify(dataToSend, undefined, 4);
    },
    async createGame() {
      const dataToSend = await this.serializeSettings();

      if (dataToSend === undefined) {
        return;
      }
      createGameSettingsStorage.saveSettings(JSON.parse(dataToSend) as JSONObject);
      const onSuccess = (json: NewGameResponse) => {
        window.location.href = 'player?id=' + json.playerId;
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
