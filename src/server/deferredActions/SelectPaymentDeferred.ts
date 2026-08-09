import {IPlayer} from '../IPlayer';
import {SelectPayment} from '../inputs/SelectPayment';
import {Payment} from '../../common/inputs/Payment';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';
import {Units} from '../../common/Units';

export type Options = {
  canUseSteel?: boolean;
  canUseTitanium?: boolean;
  canUseSeeds?: boolean,
  canUseAuroraiData?: boolean,
  canUseGraphene?: boolean;
  canUseAsteroids?: boolean;
  canUseSpireScience?: boolean,
  reserveUnits?: Units | undefined;
  title?: string | Message;
}

export class SelectPaymentDeferred extends DeferredAction<Payment> {
  constructor(
    player: IPlayer,
    public amount: number,
    public options: Options = {},
  ) {
    super(player, Priority.DEFAULT);
  }

  private mustPayWithMegacredits() {
    if (this.player.canUseHeatAsMegaCredits && this.player.availableHeat() > 0) {
      return false;
    }
    if (this.options.canUseSteel && this.player.steel > 0) {
      return false;
    }
    if ((this.options.canUseTitanium || this.player.canUseTitaniumAsMegacredits) && this.player.titanium > 0) {
      return false;
    }

    return true;
  }

  public execute() {
    if (this.amount === 0) {
      this.cb(Payment.of({}));
      return undefined;
    }

    if (this.mustPayWithMegacredits()) {
      if (this.player.megaCredits < this.amount) {
        throw new Error(`Player does not have ${this.amount} M€`);
      }
      const payment = Payment.of({megacredits: this.amount});
      this.player.pay(payment);
      this.cb(payment);
      return undefined;
    }

    return new SelectPayment(
      this.options.title || message('Select how to spend ${0} M€', (b) => b.number(this.amount)),
      this.amount,
      {
        steel: this.options.canUseSteel || false,
        titanium: this.options.canUseTitanium || false,
        heat: this.player.canUseHeatAsMegaCredits,
        lunaTradeFederationTitanium: this.player.canUseTitaniumAsMegacredits,
      }, this.options.reserveUnits)
      .andThen((payment) => {
        this.player.pay(payment);
        this.cb(payment);
        return undefined;
      });
  }
}
