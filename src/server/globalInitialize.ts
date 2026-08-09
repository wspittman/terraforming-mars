import {registerBehaviorExecutor} from './behavior/BehaviorExecutor';
import {Executor} from './behavior/Executor';

export function globalInitialize() {
  registerBehaviorExecutor(new Executor());
}
