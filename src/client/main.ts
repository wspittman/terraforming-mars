import {createApp, defineAsyncComponent} from 'vue';

import {trimEmptyTextNodes} from '@/client/directives/TrimWhitespace';
import App from '@/client/components/App.vue';
import i18nPlugin from '@/client/plugins/i18n.plugin';
import {startOauth} from '@/client/oauth';
const PlayerInputFactory = defineAsyncComponent(() => import(/* webpackChunkName: "player-input" */ '@/client/components/PlayerInputFactory.vue'));

function bootstrap() {
  const app = createApp(App);

  app.use(i18nPlugin);

  app.component('PlayerInputFactory', PlayerInputFactory);

  app.directive('trim-whitespace', {
    mounted: trimEmptyTextNodes,
    updated: trimEmptyTextNodes,
  });

  if (window.isSecureContext && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('registered the service worker', registration);
      });
    });
  }

  app.mount('#app');

  window.onload = startOauth;
}

bootstrap();
