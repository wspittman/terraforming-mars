import { cast } from '@/common/utils/utils';
import { expect } from 'chai';
import { CardResource } from '../../src/common/CardResource';
import {
  RemoveResourcesFromCard,
  Response,
} from '../../src/server/deferredActions/RemoveResourcesFromCard';
import { testGame } from '../TestGame';

// This requires a lot more tests
describe('RemoveResourcesFromCard', () => {
  let response: Response;
  const andThen = (c: Response) => {
    response = c;
  };

  beforeEach(() => {
    response = undefined as unknown as Response;
  });

  it('simple', () => {
    const [, /* game */ player] = testGame(3);
    const action = new RemoveResourcesFromCard(
      player,
      CardResource.MICROBE,
      1,
      { source: 'self', blockable: false },
    ).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({
      card: undefined,
      owner: undefined,
      proceed: false,
    });
  });
});
