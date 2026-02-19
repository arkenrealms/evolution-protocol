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

  it('normalizes orderBy direction casing and whitespace', () => {
    const parsed = queryInput.parse({ orderBy: { createdDate: ' DESC ' } });

    expect(parsed).toMatchObject({ orderBy: { createdDate: 'desc' } });
  });

  it('rejects invalid orderBy direction values', () => {
    expect(() => queryInput.parse({ orderBy: { createdDate: 'descending' } })).toThrow();
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

  it('accepts top-level AND as a single object', () => {
    const parsed = queryInput.parse({
      where: {
        AND: {
          status: {
            equals: 'Active',
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
      },
    });
  });

  it('accepts top-level OR as a single object', () => {
    const parsed = queryInput.parse({
      where: {
        OR: {
          status: {
            equals: 'Pending',
          },
        },
      },
    });

    expect(parsed).toMatchObject({
      where: {
        OR: {
          status: {
            equals: 'Pending',
          },
        },
      },
    });
  });
});

describe('util/schema exported Query logical compatibility', () => {
  it('accepts single-object where.AND', () => {
    const parsed = Query.parse({
      where: {
        AND: {
          status: {
            equals: 'Active',
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
      },
    });
  });

  it('accepts single-object where.OR', () => {
    const parsed = Query.parse({
      where: {
        OR: {
          status: {
            equals: 'Pending',
          },
        },
      },
    });

    expect(parsed).toMatchObject({
      where: {
        OR: {
          status: {
            equals: 'Pending',
          },
        },
      },
    });
  });

  it('coerces numeric-string pagination values', () => {
    const parsed = Query.parse({
      skip: '2',
      take: '7',
    });

    expect(parsed).toMatchObject({
      skip: 2,
      take: 7,
    });
  });

  it('rejects negative pagination values', () => {
    expect(() =>
      Query.parse({
        skip: -1,
      })
    ).toThrow();
  });

  it('rejects infinite pagination values', () => {
    expect(() =>
      Query.parse({
        take: Number.POSITIVE_INFINITY,
      })
    ).toThrow();
  });

  it('normalizes Query orderBy direction casing and whitespace', () => {
    const parsed = Query.parse({
      orderBy: {
        createdDate: ' ASC ',
      },
    });

    expect(parsed).toMatchObject({
      orderBy: {
        createdDate: 'asc',
      },
    });
  });

  it('rejects invalid Query orderBy direction values', () => {
    expect(() =>
      Query.parse({
        orderBy: {
          createdDate: 'ascending',
        },
      })
    ).toThrow();
  });
});
