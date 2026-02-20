// arken/packages/evolution/packages/protocol/test/schema.test.ts
//
import { z } from 'zod';
import { getQueryInput, Query } from '../util/schema';

describe('util/schema Query logical-operator normalization', () => {
  it('normalizes top-level AND single objects to arrays', () => {
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
        AND: [
          {
            status: {
              equals: 'Active',
            },
          },
        ],
      },
    });
  });

  it('normalizes top-level OR single objects to arrays', () => {
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
        OR: [
          {
            status: {
              equals: 'Pending',
            },
          },
        ],
      },
    });
  });
});


describe('util/schema Query pagination and sort envelope validation', () => {
  it('coerces numeric string pagination values', () => {
    const parsed = Query.parse({ skip: '2', take: '5' });

    expect(parsed).toMatchObject({ skip: 2, take: 5 });
  });

  it('maps limit to take when take is not provided', () => {
    const parsed = Query.parse({ limit: '4', skip: '1' });

    expect(parsed).toMatchObject({ skip: 1, limit: 4, take: 4 });
  });

  it('keeps explicit take when both limit and take are provided', () => {
    const parsed = Query.parse({ limit: '4', take: '7' });

    expect(parsed).toMatchObject({ limit: 4, take: 7 });
  });

  it('rejects empty orderBy objects', () => {
    expect(() => Query.parse({ orderBy: {} })).toThrow('orderBy must include at least one field');
  });

  it('rejects blank orderBy field names', () => {
    expect(() => Query.parse({ orderBy: { '': 'asc' } })).toThrow('orderBy field names must be non-empty');
    expect(() => Query.parse({ orderBy: { '   ': 'desc' } })).toThrow('orderBy field names must be non-empty');
  });

  it('rejects empty include/select maps', () => {
    expect(() => Query.parse({ include: {} })).toThrow('map must include at least one field');
    expect(() => Query.parse({ select: {} })).toThrow('map must include at least one field');
  });

  it('rejects blank include/select field names', () => {
    expect(() => Query.parse({ include: { '': true } })).toThrow('map field names must be non-empty');
    expect(() => Query.parse({ select: { '   ': true } })).toThrow('map field names must be non-empty');
  });

  it('rejects include/select maps with only false values', () => {
    expect(() => Query.parse({ include: { profile: false } })).toThrow('map must include at least one true field');
    expect(() => Query.parse({ select: { id: false, status: false } })).toThrow('map must include at least one true field');
  });
});

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

  it('rejects empty orderBy objects', () => {
    expect(() => queryInput.parse({ orderBy: {} })).toThrow('orderBy must include at least one field');
  });

  it('accepts non-empty orderBy objects', () => {
    const parsed = queryInput.parse({ orderBy: { createdDate: 'desc' } });

    expect(parsed).toMatchObject({ orderBy: { createdDate: 'desc' } });
  });

  it('rejects blank orderBy field names', () => {
    expect(() => queryInput.parse({ orderBy: { '': 'asc' } })).toThrow('orderBy field names must be non-empty');
    expect(() => queryInput.parse({ orderBy: { '   ': 'desc' } })).toThrow('orderBy field names must be non-empty');
  });

  it('rejects empty include/select maps', () => {
    expect(() => queryInput.parse({ include: {} })).toThrow('map must include at least one field');
    expect(() => queryInput.parse({ select: {} })).toThrow('map must include at least one field');
  });

  it('rejects blank include/select field names', () => {
    expect(() => queryInput.parse({ include: { '': true } })).toThrow('map field names must be non-empty');
    expect(() => queryInput.parse({ select: { '   ': true } })).toThrow('map field names must be non-empty');
  });

  it('rejects include/select maps with only false values', () => {
    expect(() => queryInput.parse({ include: { profile: false } })).toThrow('map must include at least one true field');
    expect(() => queryInput.parse({ select: { id: false, status: false } })).toThrow('map must include at least one true field');
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

  it('normalizes top-level AND single objects to arrays', () => {
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
        AND: [
          {
            status: {
              equals: 'Active',
            },
          },
        ],
      },
    });
  });

  it('normalizes top-level OR single objects to arrays', () => {
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
        OR: [
          {
            status: {
              equals: 'Pending',
            },
          },
        ],
      },
    });
  });

  it('accepts valid case-sensitivity mode values', () => {
    const parsed = queryInput.parse({
      where: {
        status: {
          contains: 'arc',
          mode: 'insensitive',
        },
      },
    });

    expect(parsed).toMatchObject({
      where: {
        status: {
          contains: 'arc',
          mode: 'insensitive',
        },
      },
    });
  });

  it('rejects invalid case-sensitivity mode values', () => {
    expect(() =>
      queryInput.parse({
        where: {
          status: {
            contains: 'arc',
            mode: 'loose',
          },
        },
      })
    ).toThrow();
  });
});
