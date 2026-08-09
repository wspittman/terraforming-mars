// Common code for SelectPayment and SelectProjectCardToPlay
import {defineComponent} from 'vue';
import {CardModel} from '@/common/models/CardModel';
import {SelectPaymentModel, SelectProjectCardToPlayModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Units} from '@/common/Units';
import {DEFAULT_PAYMENT_VALUES, Payment} from '@/common/inputs/Payment';
import {SpendableResource} from '@/common/inputs/Spendable';
import {Ledger, newDefaultLedger} from '../components/PaymentLedger';
import {ALL_RESOURCES} from '@/common/Resource';

export type DataModel = {
  cost: number,
  payment: Payment,
  card: CardModel | undefined,
  available: Units | undefined,
};

export const PaymentWidgetMixin = defineComponent({
  // Props are intentionally re-declared by consumers (SelectPayment, SelectProjectCardToPlay)
  // to narrow playerinput's type. Component declarations override mixin declarations in Vue's
  // merge, so this broad union is only used within the mixin's own methods.
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
    playerinput: {
      type: Object as () => SelectPaymentModel | SelectProjectCardToPlayModel,
      required: true,
    },
  },
  data(): DataModel {
    return {
      // payment and cost are shared by both consumers.
      cost: 0,
      payment: {...Payment.EMPTY},
      // card and available are undefined here; SelectProjectCardToPlay overrides both in its
      // own data(). SelectPayment never sets them — getAvailableUnits takes the fallback
      // path when available is undefined, and card is only accessed with optional chaining.
      card: undefined,
      available: undefined,
    };
  },
  methods: {
    buildLedger(
      order: ReadonlyArray<SpendableResource>,
      reserveUnits: Units,
    ): Ledger {
      const ledger = newDefaultLedger();

      function isStandardResource(x: any): x is keyof Units {
        return ALL_RESOURCES.includes(x);
      }

      const available = this.getAvailableUnits();
      for (const unit of order) {
        ledger[unit] = {
          available: available[unit],
          rate: this.getResourceRate(unit),
          reserved: isStandardResource(unit) ? reserveUnits[unit] > 0 : false,
        };
      }
      return ledger;
    },

    getResourceRate(unit: SpendableResource): number {
      switch (unit) {
      case 'steel':
        return this.playerView.thisPlayer.steelValue;
      case 'titanium':
        return this.getTitaniumResourceRate();
      default:
        return DEFAULT_PAYMENT_VALUES[unit];
      }
    },
    getTitaniumResourceRate(): number {
      const paymentOptions = this.playerinput.paymentOptions;
      const titaniumValue = this.playerView.thisPlayer.titaniumValue;
      if (paymentOptions?.titanium !== true &&
        paymentOptions?.lunaTradeFederationTitanium === true) {
        return titaniumValue - 1;
      }
      return titaniumValue;
    },
    getAvailableUnits(): Record<SpendableResource, number> {
      const thisPlayer = this.playerView.thisPlayer;
      const units: Record<SpendableResource, number> = {
        megacredits: thisPlayer.megacredits,
        heat: this.available ? this.available.heat : this.availableHeat(),
        steel: this.available ? this.available.steel : thisPlayer.steel,
        titanium: this.available ? this.available.titanium : thisPlayer.titanium,
        plants: this.available ? this.available.plants : thisPlayer.plants,
        microbes: this.playerinput.microbes,
        floaters: this.playerinput.floaters,
      };

      return units;
    },
    availableHeat(): number {
      return this.playerView.thisPlayer.heat;
    },
  },
});
