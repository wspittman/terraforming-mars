import {Card, productionBoxWithBonusResource} from '../Card';
import {CardMetadata} from '../../../common/cards/CardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../../cards/IProjectCard';
import {Space} from '../../boards/Space';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Tag} from '../../../common/cards/Tag';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {TileType} from '../../../common/TileType';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';

export abstract class MiningCard extends Card implements IProjectCard {
  public bonusResource: Array<Resource> | undefined;
  protected abstract readonly title: string;
  protected readonly placeTile: boolean = true;

  constructor(
    name: CardName,
    cost: number,
    metadata: CardMetadata) {
    super({
      type: CardType.AUTOMATED,
      name,
      tags: [Tag.BUILDING],
      cost,
      metadata,
    });
  }
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }

  protected getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space) => space.bonus.includes(SpaceBonus.STEEL) || space.bonus.includes(SpaceBonus.TITANIUM));
  }

  private getTileType(_bonus: SpaceBonus.STEEL | SpaceBonus.TITANIUM): TileType {
    if (this.name === CardName.MINING_RIGHTS) {
      return TileType.MINING_RIGHTS;
    }
    return TileType.MINING_AREA;
  }

  public productionBox() {
    return productionBoxWithBonusResource(this);
  }

  public override bespokePlay(player: IPlayer): SelectSpace {
    return new SelectSpace(this.title, this.getAvailableSpaces(player))
      .andThen((space) => {
        this.spaceSelected(player, space);
        return undefined;
      });
  }

  protected spaceSelected(player: IPlayer, space: Space): void {
    const bonusResources = [];
    if (space.bonus.includes(SpaceBonus.STEEL)) {
      bonusResources.push(Resource.STEEL);
    }
    if (space.bonus.includes(SpaceBonus.TITANIUM)) {
      bonusResources.push(Resource.TITANIUM);
    }

    player.game.defer(
      new SelectResourceTypeDeferred(
        player,
        bonusResources,
        'Select a resource to gain 1 unit of production'))
      .andThen((resource) => {
        player.production.add(resource, 1, {log: true});
        this.bonusResource = [resource];
        if (this.placeTile) {
          const spaceBonus = resource === Resource.TITANIUM ? SpaceBonus.TITANIUM : SpaceBonus.STEEL;
          player.game.addTile(player, space, {tileType: this.getTileType(spaceBonus)});
        }
      });
  }
}
