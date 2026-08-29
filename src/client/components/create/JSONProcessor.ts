import {JSONObject} from '../../../common/Types';
import {CreateGameModel} from './CreateGameModel';
import {PLAYER_COLORS} from '@/common/Color';
import {NewPlayerModel} from '@/common/game/NewGameConfig';
import {CardName} from '@/common/cards/CardName';
import {cast} from '@/common/utils/utils';

export class JSONProcessor {
  public model: CreateGameModel;
  public warnings: Array<string>;
  public bannedCards: Array<CardName> = [];
  public includedCards: Array<CardName> = [];

  constructor(model: CreateGameModel) {
    this.model = model;
    this.warnings = [];
  }

  public applyJSON(json: JSONObject) {
    json = JSON.parse(JSON.stringify(json)); // Make a copy so as to not change the original data.

    const player = cast(json['player'], Object) as NewPlayerModel;
    const validationErrors = this.validatePlayer(player);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join('\n'));
    }

    function set<T>(field: string): Array<T> {
      return cast(json[field] ?? [], Array) as Array<T>;
    }

    this.bannedCards = set('bannedCards');
    this.includedCards = set('includedCards');

    this.model.playersCount = Number(json['playerCount']);
    this.model.showBannedCards = this.bannedCards.length > 0;
    this.model.showIncludedCards = this.includedCards.length > 0;

    const ignoredFields = [
      'corporateEra',
      'board',
      'expansions',
      'escapeVelocity',
      'escapeVelocityMode',
      'escapeVelocityBonusSeconds',
      'escapeVelocityPenalty',
      'escapeVelocityPeriod',
      'escapeVelocityThreshold',
      'fastModeOption',
      'shuffleMapOption',
      'player',
      'playerCount',
      'constants'];
    for (const k in json) {
      if (ignoredFields.includes(k)) {
        continue;
      }
      if (k in this.model) {
        // This is safe because of the in check, above.
        (this.model as any)[k] = json[k];
      } else {
        this.warnings.push('Unknown property: ' + k);
      }
    }

    this.model.player = {...player, handicap: 0};

    this.validateCardNames('customCorporations', this.model.customCorporations);
    this.validateCardNames('bannedCards', this.bannedCards);
    this.validateCardNames('includedCards', this.includedCards);
  }

  private validateCardNames(fieldLabel: string, names: ReadonlyArray<CardName>): void {
    const validNames = new Set<string>(Object.values(CardName));
    for (const name of names) {
      if (!validNames.has(name)) {
        this.warnings.push(`Unknown card name '${name}' in ${fieldLabel}`);
      }
    }
  }

  private validatePlayer(player: NewPlayerModel): Array<string> {
    const errors = [];

    // `as any` is OK here since this just validates `color`.
    if (PLAYER_COLORS.indexOf(player.color as any) === -1) {
      errors.push(player.color + ' is not a color');
    }
    return errors;
  }
}
