<template>
    <div class="help-phases-container">
      <ul>
        <li>
          <input type="checkbox" id="initial-draft">
          <label for="initial-draft" class="first"><span v-i18n>Initial Drafting</span></label>
            <ul>
              <li v-i18n>Draw 3 corporation cards</li>
              <li v-i18n>Draw 10 project cards. Draft one card and pass the rest to the player above in turn order. Repeat until you have 10 cards.</li>
            </ul>
        </li>
        <li>
          <input type="checkbox" id="generation">
          <label for="generation"><span v-i18n>Each generation</span></label>
          <ul>
            <li>
              <input type="checkbox" id="initial-research">
              <label for="initial-research" v-i18n><span v-i18n>Initial Research Phase (Generation 1 only)</span></label>
              <ul>
                <li v-i18n>Select which corporation and project cards to keep.</li>
                <li v-i18n>In turn order, play the corporation and pay 3 M€ for each of the project cards bought.</li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="research-phase">
              <label for="research-phase"><span v-i18n>Research Phase (Generation 2+)</span></label>
              <ul>
                <li v-i18n>Draw four project cards</li>
                <li v-i18n>Draft the cards. Pick one and pass the rest to the player below in even generations and above in odd generations. Repeat until you have four cards.</li>
                <li v-i18n>Decide how many cards to buy</li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="action-phase">
              <label for="action-phase" class="last"><span v-i18n>Action phase</span></label>
              <ul>
                <li><span v-i18n>Take 1 or 2 actions:</span>
                  <ul>
                    <li v-i18n>play card</li>
                    <li v-i18n>use active card action</li>
                    <li v-i18n>standard project</li>
                    <li v-i18n>convert plants to greenery</li>
                    <li v-i18n>convert heat to temperature</li>
                    <li v-i18n>claim milestone</li>
                    <li v-i18n>fund award</li>
                  </ul>
                </li>
                <li v-i18n>Pass for the generation</li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="production-phase">
              <label for="production-phase"><span v-i18n>Production Phase</span></label>
              <ul>
                <li v-i18n>Energy becomes heat</li>
                <li v-i18n>Produce resources</li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="solar-phase">
              <label for="solar-phase"><span v-i18n>Solar Phase</span></label>
              <ul>
                <li><span v-i18n>Game end check</span>
                  <ul>
                    <li v-i18n>If temperature, oxygen, and oceans are maxed, skip the rest of solar phase to the end game phase.</li>
                    <li v-i18n>(If playing solo, the game ends after 14 generations.)</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <input type="checkbox" id="end-game">
          <label for="end-game"><span v-i18n>End Game</span></label>
          <ul>
            <li v-i18n>In turn order, convert plants to greeneries.</li>
            <li v-i18n>Assign awards</li>
            <li v-i18n>Score: TR + tiles + cards + milestones + awards</li>
          </ul>
        </li>
      </ul>
    </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'HelpPhases',
});
</script>
