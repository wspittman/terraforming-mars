import {RequirementType} from '../../../common/cards/RequirementType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardRequirement} from './CardRequirement';
import {CitiesRequirement} from './CitiesRequirement';
import {GreeneriesRequirement} from './GreeneriesRequirement';
import {OceanRequirement} from './OceanRequirement';
import {OxygenRequirement} from './OxygenRequirement';
import {ProductionRequirement} from './ProductionRequirement';
import {RemovedPlantsRequirement} from './RemovedPlantsRequirement';
import {ResourceTypeRequirement} from './ResourceTypeRequirement';
import {TRRequirement} from './TRRequirement';
import {TagCardRequirement} from './TagCardRequirement';
import {TemperatureRequirement} from './TemperatureRequirement';
import {CardRequirementDescriptor} from '../../../common/cards/CardRequirementDescriptor';
import {IProjectCard} from '../IProjectCard';

export class CardRequirements {
  constructor(public requirements: Array<CardRequirement>) {}

  public satisfies(player: IPlayer, card: IProjectCard): boolean {
    if (this.requirements.length === 0) {
      return true;
    }
    // Process tags separately, though max & any tag criteria will be processed later.
    // This pre-computation takes the wild tag into account.
    const tags: Array<Tag> = [];
    for (const requirement of this.requirements) {
      if ((requirement.type === RequirementType.TAG) &&
        requirement.all !== true && requirement.max !== true) {
        tags.push((requirement as TagCardRequirement).tag);
      }
    }
    if (tags.length > 1 && !player.tags.playerHas(tags)) {
      return false;
    }
    for (const requirement of this.requirements) {
      const satisfies = requirement.satisfies(player, card);
      if (satisfies === false) {
        return false;
      }
    }
    return true;
  }

  public static compile(descriptors: Array<CardRequirementDescriptor> | undefined): CardRequirements {
    if (descriptors === undefined) {
      return new CardRequirements([]);
    }
    return new CardRequirements(descriptors.map((descriptor) => CardRequirements.compileOne(descriptor)));
  }

  private static compileOne(descriptor: CardRequirementDescriptor): CardRequirement {
    if (descriptor.tag !== undefined) {
      return new TagCardRequirement(descriptor.tag, descriptor);
    } else if (descriptor.oceans !== undefined) {
      return new OceanRequirement({...descriptor, count: descriptor.oceans});
    } else if (descriptor.oxygen !== undefined) {
      return new OxygenRequirement({...descriptor, count: descriptor.oxygen});
    } else if (descriptor.temperature !== undefined) {
      return new TemperatureRequirement({...descriptor, count: descriptor.temperature});
    } else if (descriptor.tr !== undefined) {
      return new TRRequirement({...descriptor, count: descriptor.tr});
    } else if (descriptor.resourceTypes !== undefined) {
      return new ResourceTypeRequirement({...descriptor, count: descriptor.resourceTypes});
    } else if (descriptor.greeneries !== undefined) {
      return new GreeneriesRequirement({...descriptor, count: descriptor.greeneries});
    } else if (descriptor.cities !== undefined) {
      return new CitiesRequirement({...descriptor, count: descriptor.cities});
    } else if (descriptor.production !== undefined) {
      return new ProductionRequirement(descriptor.production, descriptor);
    } else if (descriptor.plantsRemoved !== undefined) {
      return new RemovedPlantsRequirement();
    } else {
      throw new Error('Unknown requirement: ' + JSON.stringify(descriptor));
    }
  }
}
