// arken/packages/evolution/packages/protocol/test/schema.test.ts
//
import { z } from 'zod';
import { getQueryInput, Query } from '../util/schema';

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

  it('coerces numeric string pagination values', () => {
    const parsed = queryInput.parse({ take: '7', skip: '2' });

    expect(parsed).toMatchObject({ take: 7, limit: 7, skip: 2 });
  });

  it('rejects non-numeric string pagination values', () => {
    expect(() => queryInput.parse({ limit: 'ten' })).toThrow();
  });

  it('rejects negative pagination values', () => {
    expect(() => queryInput.parse({ skip: -1 })).toThrow();
  });

  it('rejects infinite pagination values', () => {
    expect(() => queryInput.parse({ limit: Number.POSITIVE_INFINITY })).toThrow();
    expect(() => queryInput.parse({ take: '1e309' })).toThrow();
  });
});

describe('util/schema getQueryInput where not-operator compatibility', () => {
  const queryInput = getQueryInput(
    z.object({
      status: z.string().optional(),
    })
  );

  it('accepts scalar `not` operators', () => {
    const parsed = queryInput.parse({ where: { status: { not: 'Paused' } } });

    expect(parsed).toMatchObject({ where: { status: { not: 'Paused' } } });
  });

  it('accepts nested `not` filter objects', () => {
    const parsed = queryInput.parse({
      where: {
        status: {
          not: {
            in: ['Paused', 'Archived'],
          },
        },
      },
    });

    expect(parsed).toMatchObject({
      where: {
        status: {
          not: {
            in: ['Paused', 'Archived'],
          },
        },
      },
    });
  });

  it('accepts top-level NOT as a single object', () => {
    const parsed = queryInput.parse({
      where: {
        NOT: {
          status: {
            equals: 'Archived',
          },
        },
      },
    });

    expect(parsed).toMatchObject({
      where: {
        NOT: {
          status: {
            equals: 'Archived',
          },
        },
      },
    });
  });
});

describe('util/schema logical operator + orderBy normalization parity', () => {
  const queryInput = getQueryInput(
    z.object({
      status: z.string().optional(),
    })
  );

  it('accepts top-level AND/OR as a single object for getQueryInput', () => {
    const parsed = queryInput.parse({
      where: {
        AND: {
          status: {
            equals: 'Active',
          },
        },
        OR: {
          status: {
            equals: 'Paused',
          },
        },
      },
    });

    expect(parsed).toMatchObject({
      where: {
        AND: {
          status: {
            equals: 'Active',
          },
        },
        OR: {
          status: {
            equals: 'Paused',
          },
        },
      },
    });
  });

  it('normalizes orderBy direction casing/whitespace for getQueryInput', () => {
    const parsed = queryInput.parse({ orderBy: { createdDate: ' DESC ' } });

    expect(parsed).toMatchObject({ orderBy: { createdDate: 'desc' } });
  });

  it('accepts top-level AND/OR as a single object for exported Query schema', () => {
    const parsed = Query.parse({
      where: {
        AND: {
          status: {
            equals: 'Active',
          },
        },
        OR: {
          status: {
            equals: 'Paused',
          },
        },
      },
    });

    expect(parsed).toMatchObject({
      where: {
        AND: {
          status: {
            equals: 'Active',
          },
        },
        OR: {
          status: {
            equals: 'Paused',
          },
        },
      },
    });
  });

  it('normalizes orderBy direction casing/whitespace for exported Query schema', () => {
    const parsed = Query.parse({ orderBy: { createdDate: ' DESC ' } });

    expect(parsed).toMatchObject({ orderBy: { createdDate: 'desc' } });
  });

  it('rejects invalid orderBy direction values', () => {
    expect(() => queryInput.parse({ orderBy: { createdDate: 'descending' } })).toThrow();
    expect(() => Query.parse({ orderBy: { createdDate: 'descending' } })).toThrow();
  });
});
