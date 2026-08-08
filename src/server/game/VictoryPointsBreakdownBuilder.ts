import {VictoryPointsBreakdown} from '../../common/game/VictoryPointsBreakdown';

export type VictoryPoints = 'terraformRating' | 'milestones' | 'awards' | 'greenery' | 'city' | 'escapeVelocity' | 'victoryPoints';

type Mutable<T> = {
  [K in keyof T]: T[K] extends ReadonlyArray<infer T> ? T[] : T[K];
};


export class VictoryPointsBreakdownBuilder {
  private readonly points: Mutable<VictoryPointsBreakdown> = {
    terraformRating: 0,
    milestones: 0,
    awards: 0,
    greenery: 0,
    city: 0,
    escapeVelocity: 0,
    victoryPoints: 0,
    total: 0,
    detailsCards: [],
    detailsMilestones: [],
    detailsAwards: [],
  };

  public build(): VictoryPointsBreakdown {
    this.updateTotal();
    return {
      terraformRating: this.points.terraformRating,
      milestones: this.points.milestones,
      awards: this.points.awards,
      greenery: this.points.greenery,
      city: this.points.city,
      escapeVelocity: this.points.escapeVelocity,
      victoryPoints: this.points.victoryPoints,
      total: this.points.total,
      detailsCards: this.points.detailsCards,
      detailsMilestones: this.points.detailsMilestones,
      detailsAwards: this.points.detailsAwards,
    };
  }

  private updateTotal(): void {
    this.points.total = 0;
    this.points.total += this.points.terraformRating;
    this.points.total += this.points.milestones;
    this.points.total += this.points.awards;
    this.points.total += this.points.greenery;
    this.points.total += this.points.city;
    this.points.total += this.points.escapeVelocity;
    this.points.total += this.points.victoryPoints;
  }

  public setVictoryPoints(key: VictoryPoints, points: number, message?: string, messageArgs?: Array<string>) {
    switch (key) {
    case 'terraformRating':
      this.points.terraformRating += points;
      break;
    case 'milestones':
      this.points.milestones += points;
      if (message !== undefined) {
        this.points.detailsMilestones.push({message: message, victoryPoint: points, messageArgs: messageArgs});
      }
      break;
    case 'awards':
      this.points.awards += points;
      if (message !== undefined) {
        this.points.detailsAwards.push({message: message, victoryPoint: points, messageArgs: messageArgs});
      }
      break;
    case 'greenery':
      this.points.greenery += points;
      break;
    case 'city':
      this.points.city += points;
      break;
    case 'escapeVelocity':
      this.points.escapeVelocity += points;
      break;
    case 'victoryPoints':
      this.points.victoryPoints += points;
      if (message !== undefined) {
        this.points.detailsCards.push({cardName: message, victoryPoint: points});
      }
      break;
    default:
      console.warn('Unknown victory point constraint ' + key);
      break;
    }
  }
}
