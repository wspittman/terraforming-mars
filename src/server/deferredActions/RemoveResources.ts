import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';

export class RemoveResources extends DeferredAction<number> {
  constructor(
    private target: IPlayer,
    public perpetrator: IPlayer,
    public resource: Resource,
    public count: number = 1,
  ) {
    super(target, Priority.ATTACK_OPPONENT);
  }

  public execute() {
    if (this.resource === Resource.PLANTS) {
      if (this.target.plantsAreProtected()) {
        this.cb(0);
        return undefined;
      }
    }
    if (this.resource === Resource.STEEL || this.resource === Resource.TITANIUM) {
      if (this.target.alloysAreProtected()) {
        this.cb(0);
        return undefined;
      }
    }

    const qtyLost = Math.min(this.target.stock.get(this.resource), this.count);

    if (qtyLost === 0) {
      return undefined;
    }
    this.target.stock.deduct(this.resource, qtyLost, {log: true, from: {player: this.perpetrator}});
    this.cb(qtyLost);
    return undefined;
  }
}
