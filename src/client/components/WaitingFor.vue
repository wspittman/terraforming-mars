<template>
  <div>
  <template v-if="waitingfor === undefined || waitingfor.optional">
    <template v-if="waitingfor === undefined">
      {{ $t('Not your turn to take any actions') }}
    </template>
    <template v-else>
      {{ $t('Waiting for other players') }}
    </template>
  </template>
  <div v-if="waitingfor !== undefined" class="wf-root">
    <PlayerInputFactory :players="playerView.players"
                          :playerView="playerView"
                          :playerinput="waitingfor"
                          :onsave="onsave"
                          :showsave="true"
                          :showtitle="true" />
    </div>
  </div>
</template>

<script lang="ts">
/* global RequestInit */

import {defineComponent} from 'vue';
import * as constants from '@/common/constants';
import raw_settings from '@/genfiles/settings.json';
import {vueRoot} from '@/client/components/vueRoot';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, ViewModel} from '@/common/models/PlayerModel';
import {WaitingForModel} from '@/common/models/WaitingForModel';
import {paths} from '@/common/app/paths';
import {statusCode} from '@/common/http/statusCode';
import {InputResponse} from '@/common/inputs/InputResponse';
import {INVALID_RUN_ID, AppErrorResponse} from '@/common/app/AppErrorId';
import {gameDocumentTitle} from '../utils/documentTitle';

let ui_update_timeout_id: number | undefined;
const CANNOT_CONTACT_SERVER = 'Unable to reach the server. It may be restarting or down for maintenance.';

export default defineComponent({
  name: 'WaitingFor',
  props: {
    playerView: {
      type: Object as () => ViewModel,
      required: true,
    },
    waitingfor: {
      type: Object as () => PlayerInputModel | undefined,
      default: undefined,
    },
  },
  methods: {
    onsave(out: InputResponse) {
      this.fetchPlayerInput(
        paths.PLAYER_INPUT + '?id=' + this.playerView.id,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({runId: this.playerView.runId, ...out}),
        });
    },
    reset() {
      this.fetchPlayerInput(
        paths.RESET + '?id=' + this.playerView.id,
        {method: 'GET'});
    },
    fetchPlayerInput(url: string, options: RequestInit) {
      const root = vueRoot(this);
      if (root.isServerSideRequestInProgress) {
        console.warn('Server request in progress');
        return;
      }

      root.isServerSideRequestInProgress = true;
      fetch(url, options)
        .then(async (response) => {
          if (response.ok) {
            this.updatePlayerView(await response.json());
            return;
          }

          const showAlert = vueRoot(this).showAlert;
          if (response.status === statusCode.badRequest) {
            const resp = await response.json() as AppErrorResponse;
            let cb = () => {};
            if (resp.id === INVALID_RUN_ID) {
              cb = () => setTimeout(() => window.location.reload(), 100);
            }
            showAlert('Error with input', resp.message, cb);
          } else {
            showAlert('Error processing response', 'Unexpected response from server. Please try again.');
            console.error(response.statusText);
          }
        })
        .catch((e) => {
          root.showAlert('Error sending input,', CANNOT_CONTACT_SERVER);
          console.error(e);
        })
        .finally(() => {
          root.isServerSideRequestInProgress = false;
        });
    },
    updatePlayerView(playerView: PlayerViewModel | undefined) {
      const root = vueRoot(this);
      root.screen = 'empty';
      root.playerView = playerView;
      root.playerkey++;
      root.screen = 'player-home';
      if (this.playerView.game.phase === 'end' && window.location.pathname !== paths.THE_END) {
        window.location = window.location as any as (string & Location);
      }
    },
    waitForUpdate() {
      const vueApp = this;
      const root = vueRoot(this);
      clearTimeout(ui_update_timeout_id);
      const askForUpdate = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', paths.API_WAITING_FOR + window.location.search + '&gameAge=' + this.playerView.game.gameAge + '&undoCount=' + this.playerView.game.undoCount);
        xhr.onerror = function() {
          root.showAlert('Error fetching state', CANNOT_CONTACT_SERVER, () => vueApp.waitForUpdate());
        };
        xhr.onload = () => {
          if (xhr.status === statusCode.ok) {
            const result = xhr.response as WaitingForModel;
            if (result.result === 'GO') {
              // Will only apply to player, not spectator.
              root.updatePlayer();
              this.notify();
              // We don't need to wait anymore - it's our turn
              return;
            } else if (result.result === 'REFRESH') {
              // Something changed, let's refresh UI
              root.updatePlayer();
              return;
            }
            vueApp.waitForUpdate();
          } else {
            root.showAlert('Error with input', `Received unexpected response from server (${xhr.status}). This is often due to the server restarting.`, () => vueApp.waitForUpdate());
          }
        };
        xhr.responseType = 'json';
        xhr.send();
      };
      ui_update_timeout_id = window.setTimeout(askForUpdate, raw_settings.waitingForTimeout);
    },
    notify() {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      } else if (Notification.permission === 'granted') {
        const notificationOptions = {
          icon: 'favicon.ico',
          body: 'It\'s your turn!',
        };
        const notificationTitle = constants.APP_NAME;
        try {
          new Notification(notificationTitle, notificationOptions);
        } catch (e) {
          // ok so the native Notification doesn't work which will happen
          // try to use the service worker
          if (!window.isSecureContext || !navigator.serviceWorker) {
            return;
          }
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(notificationTitle, notificationOptions);
          }).catch((err) => {
            // avoid promise going uncaught
            console.warn('Failed to display notification with serviceWorker', err);
          });
        }
      }
    },
  },
  mounted() {
    document.title = gameDocumentTitle(this.playerView.game);
    if (this.waitingfor === undefined || this.waitingfor.optional) {
      this.waitForUpdate();
    }
  },
});

</script>
