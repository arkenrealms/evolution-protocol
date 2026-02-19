import { z } from 'zod';
import { getQueryInput } from '../util/schema';

describe('util/schema getQueryInput pagination aliases', () => {
  const queryInput = getQueryInput(
    z.object({
      id: z.string().optional(),
      status: z.string().optional(),
    })
  );

  it('maps take to limit when limit is not provided', () => {
    const parsed = queryInput.parse({ take: 25, skip: 5 });

    expect(parsed).toMatchObject({ take: 25, limit: 25, skip: 5 });
  });

  it('keeps explicit limit when both take and limit are provided', () => {
    const parsed = queryInput.parse({ take: 25, limit: 10 });

    expect(parsed).toMatchObject({ take: 25, limit: 10 });
  });
});
