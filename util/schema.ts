// arken/packages/evolution/packages/protocol/util/schema.ts
//
import Mongoose, { Types } from 'mongoose';
import { z as zod, ZodTypeAny, ZodLazy, ZodObject, ZodArray } from 'zod';
import { AnyProcedure, inferProcedureOutput, AnyRouter, AnyTRPCClientTypes, TRPCRouterRecord } from '@trpc/server';

export type { inferRouterInputs } from '@trpc/server';

export const z = zod;

// @ts-ignore
export const ObjectId = z.union([
  z.string().refine((value) => Mongoose.isValidObjectId(value), {
    // Accept valid ObjectId strings
    message: 'Invalid ObjectId',
  }),
  z.instanceof(Types.ObjectId), // Accept Mongoose ObjectId instances
]);

export const Anything = z.any();
export const Nothing = z.object({});
export const Signature = z.object({ hash: z.string(), address: z.string() });
export const UnsignedData = z.object({ data: z.any() });
export const SignedData = z.object({
  data: z.any(),
  signature: Signature,
});

export const AnyInput = z.any();
export const OnlySignatureInput = z.object({ signature: Signature });
export const NoDataOutput = z.object({ status: z.number() });
export const AnyDataOutput = z.object({ data: z.any(), status: z.number() });

export enum Status {
  Paused = 'Paused',
  Pending = 'Pending',
  Active = 'Active',
  Archived = 'Archived',
}

export type Meta = {
  [key: string]: unknown;
};

export const Common = z.object({
  id: ObjectId.optional(),
  meta: z.any(), // Default value set here matches Mongoose
  data: z.any(), // Default value set here matches Mongoose
  status: z.enum(['Paused', 'Pending', 'Active', 'Archived']).default('Active'), // Default set in StatusEnum matches Mongoose
  merkleLeaf: z.string().optional(),
  merkleIndex: z.number().optional(),
  createdById: ObjectId.optional(),
  editedById: ObjectId.optional(),
  deletedById: ObjectId.optional(),
  createdDate: z.date().default(() => new Date()), // Default matches Mongoose
  updatedDate: z.date().optional(),
  deletedDate: z.date().optional(),
});

export type Common = zod.infer<typeof Common>;

export const Entity = z
  .object({
    id: z.string().min(24).max(24).trim().optional(),
    key: z.string().min(1).max(200).trim().optional(),
    name: z.string().min(1).max(200).trim().optional(),
    description: z.string().optional(),
    applicationId: ObjectId.optional(),
    ownerId: ObjectId.optional(),
  })
  .merge(Common);

export type Entity = zod.infer<typeof Entity>;

const QueryFilterOperators = z.preprocess(
  (input) => {
    if (input === undefined) {
      return input;
    }

    if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
      return input;
    }

    return { equals: input };
  },
  z
    .object({
      equals: z.any().optional(),
      not: z.any().optional(),
      in: z.array(z.any()).nonempty('in operator must include at least one value').optional(),
      notIn: z.array(z.any()).nonempty('notIn operator must include at least one value').optional(),
      lt: z.any().optional(),
      lte: z.any().optional(),
      gt: z.any().optional(),
      gte: z.any().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: z.enum(['default', 'insensitive']).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'where filter must include at least one operator',
    })
);

const normalizeLogicalArray = (schema: zod.ZodTypeAny) =>
  z.preprocess(
    (input) => {
      if (input === undefined) {
        return input;
      }

      return Array.isArray(input) ? input : [input];
    },
    z.array(schema).nonempty('logical filters must include at least one clause')
  );

const QueryWhereSchema = z.lazy(() =>
  z.object({
    AND: normalizeLogicalArray(QueryWhereSchema).optional(),
    OR: normalizeLogicalArray(QueryWhereSchema).optional(),
    NOT: z.union([QueryWhereSchema, z.array(QueryWhereSchema).nonempty('logical filters must include at least one clause')]).optional(),
    id: QueryFilterOperators.optional(),
    key: QueryFilterOperators.optional(),
    name: QueryFilterOperators.optional(),
    email: QueryFilterOperators.optional(),
    status: QueryFilterOperators.optional(),
  })
);

const QueryPaginationValue = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }

  return value;
}, z.number().int().nonnegative().finite());

const hasStrictFieldNames = (value: Record<string, unknown>) =>
  Object.keys(value).every((key) => key.trim().length > 0 && key === key.trim());

const NonEmptyBooleanMap = z
  .record(z.boolean())
  .refine((value) => Object.keys(value).length > 0, {
    message: 'map must include at least one field',
  })
  .refine((value) => hasStrictFieldNames(value), {
    message: 'map field names must be non-empty and trimmed',
  })
  .refine((value) => Object.values(value).some((entry) => entry === true), {
    message: 'map must include at least one true field',
  });

const NonEmptyCursorMap = z
  .record(z.any())
  .refine((value) => Object.keys(value).length > 0, {
    message: 'cursor must include at least one field',
  })
  .refine((value) => hasStrictFieldNames(value), {
    message: 'cursor field names must be non-empty and trimmed',
  })
  .refine((value) => Object.values(value).some((entry) => entry !== undefined && entry !== null), {
    message: 'cursor must include at least one defined value',
  })
  .refine(
    (value) =>
      Object.values(value).some((entry) => {
        if (entry === undefined || entry === null) {
          return false;
        }

        return typeof entry !== 'string' || entry.trim().length > 0;
      }),
    {
      message: 'cursor must include at least one non-empty value',
    }
  );

export const Query = z
  .object({
    skip: QueryPaginationValue.default(0).optional(),
    take: QueryPaginationValue.default(10).optional(),
    limit: QueryPaginationValue.optional(),
    cursor: NonEmptyCursorMap.optional(),
    where: QueryWhereSchema.optional(),
    orderBy: z
      .record(z.enum(['asc', 'desc']))
      .refine((value) => Object.keys(value).length > 0, {
        message: 'orderBy must include at least one field',
      })
      .refine((value) => hasStrictFieldNames(value), {
        message: 'orderBy field names must be non-empty and trimmed',
      })
      .optional(),
    include: NonEmptyBooleanMap.optional(),
    select: NonEmptyBooleanMap.optional(),
  })
  .superRefine((query, ctx) => {
    if (query.include !== undefined && query.select !== undefined) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'include and select cannot be combined',
        path: ['select'],
      });
    }
  })
  .transform((query) => {
    if (query.limit !== undefined && query.take === undefined) {
      return { ...query, take: query.limit };
    }

    return query;
  });

// // Operators for filtering in a Prisma-like way
// type PrismaFilterOperators<T extends ZodTypeAny> = zod.ZodObject<
//   {
//     equals?: T;
//     not?: T;
//     in?: zod.ZodArray<T>;
//     notIn?: zod.ZodArray<T>;
//     lt?: T;
//     lte?: T;
//     gt?: T;
//     gte?: T;
//     contains?: zod.ZodString; // T extends zod.ZodString ? zod.ZodString : never;
//     startsWith?: zod.ZodString; // T extends zod.ZodString ? zod.ZodString : never;
//     endsWith?: zod.ZodString; // T extends zod.ZodString ? zod.ZodString : never;
//     mode?: zod.ZodString; // T extends zod.ZodString ? zod.ZodEnum<['default', 'insensitive']> : never;
//   },
//   'strip',
//   ZodTypeAny
// >;

// // Level 0: No AND, OR, NOT
// type PrismaWhereLevel0<T extends zod.ZodRawShape> = ZodObject<
//   {
//     [K in keyof T]?: PrismaFilterOperators<T[K]>;
//   },
//   'strip',
//   ZodTypeAny
// >;

// // Level 1: Includes AND, OR, NOT of Level 0
// type PrismaWhereLevel1<T extends zod.ZodRawShape> = ZodObject<
//   {
//     AND?: ZodArray<ZodLazy<PrismaWhereLevel0<T>>>;
//     OR?: ZodArray<ZodLazy<PrismaWhereLevel0<T>>>;
//     NOT?: ZodArray<ZodLazy<PrismaWhereLevel0<T>>>;
//   } & {
//     [K in keyof T]?: PrismaFilterOperators<T[K]>;
//   },
//   'strip',
//   ZodTypeAny
// >;

// // Level 2: Includes AND, OR, NOT of Level 1
// type PrismaWhereLevel2<T extends zod.ZodRawShape> = ZodObject<
//   {
//     AND?: ZodArray<ZodLazy<PrismaWhereLevel1<T>>>;
//     OR?: ZodArray<ZodLazy<PrismaWhereLevel1<T>>>;
//     NOT?: ZodArray<ZodLazy<PrismaWhereLevel1<T>>>;
//   } & {
//     [K in keyof T]?: PrismaFilterOperators<T[K]>;
//   },
//   'strip',
//   ZodTypeAny
// >;

// // Level 3: Includes AND, OR, NOT of Level 2
// type PrismaWhereLevel3<T extends zod.ZodRawShape> = ZodObject<
//   {
//     AND?: ZodArray<ZodLazy<PrismaWhereLevel2<T>>>;
//     OR?: ZodArray<ZodLazy<PrismaWhereLevel2<T>>>;
//     NOT?: ZodArray<ZodLazy<PrismaWhereLevel2<T>>>;
//   } & {
//     [K in keyof T]?: PrismaFilterOperators<T[K]>;
//   },
//   'strip',
//   ZodTypeAny
// >;

// // Level 4: Includes AND, OR, NOT of Level 3
// type PrismaWhereLevel4<T extends zod.ZodRawShape> = ZodObject<
//   {
//     AND?: ZodArray<ZodLazy<PrismaWhereLevel3<T>>>;
//     OR?: ZodArray<ZodLazy<PrismaWhereLevel3<T>>>;
//     NOT?: ZodArray<ZodLazy<PrismaWhereLevel3<T>>>;
//   } & {
//     [K in keyof T]?: PrismaFilterOperators<T[K]>;
//   },
//   'strip',
//   ZodTypeAny
// >;

// Function to create a recursive schema up to level 4
export const createPrismaWhereSchema = <T extends zod.ZodRawShape>(
  modelSchema: zod.ZodObject<T>,
  depth: number = 3
): zod.ZodObject<any> => {
  const fields = modelSchema.shape;

  /**
   * For each field, accept either:
   *   - a full operator object: { equals, in, lt, ... }
   *   - OR a raw value shorthand: 'foo'  -> { equals: 'foo' }
   */
  const makeFieldFilter = (value: zod.ZodTypeAny) => {
    let opsSchema: zod.ZodTypeAny;

    opsSchema = zod
      .object({
        equals: value.optional(),
        not: zod.union([value, zod.lazy(() => opsSchema)]).optional(),
        in: zod.array(value).nonempty('in operator must include at least one value').optional(),
        notIn: zod.array(value).nonempty('notIn operator must include at least one value').optional(),
        lt: value.optional(),
        lte: value.optional(),
        gt: value.optional(),
        gte: value.optional(),
        contains: zod.string().optional(),
        startsWith: zod.string().optional(),
        endsWith: zod.string().optional(),
        mode: zod.enum(['default', 'insensitive']).optional(),
      })
      .partial()
      .refine((entry) => Object.keys(entry).length > 0, {
        message: 'where filter must include at least one operator',
      });

    return zod
      .preprocess((input) => {
        // let undefined through
        if (input === undefined) return input;

        // Already an object (likely { equals, in, ... }) → validate as-is
        if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
          return input;
        }

        // Prisma-style shorthand: profileId: 'abc'  -> { equals: 'abc' }
        return { equals: input };
      }, opsSchema)
      .optional();
  };

  const fieldFilters = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, makeFieldFilter(value)]));

  if (depth <= 0) {
    // Base case: no AND/OR/NOT
    return zod.object({
      ...fieldFilters,
    });
  }

  const recursiveWhere = zod.lazy(() => createPrismaWhereSchema(modelSchema, depth - 1));

  const normalizeLogicalArray = zod.preprocess(
    (input) => {
      if (input === undefined) {
        return input;
      }

      return Array.isArray(input) ? input : [input];
    },
    zod.array(recursiveWhere).nonempty('logical filters must include at least one clause')
  );

  return zod.object({
    AND: normalizeLogicalArray.optional(),
    OR: normalizeLogicalArray.optional(),
    NOT: zod.union([recursiveWhere, zod.array(recursiveWhere).nonempty('logical filters must include at least one clause')]).optional(),
    ...fieldFilters,
  });
};

export const getQueryOutput = <T extends zod.ZodTypeAny>(data: T) => {
  return z.object({ status: z.number(), data: data.optional(), error: z.string().optional() });
};

export const getQueryInput = <S extends zod.ZodTypeAny>(schema: S, options: { partialData?: boolean } = {}) => {
  const { partialData = true } = options;

  const numericQueryValue = zod.preprocess((value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value);
    }

    return value;
  }, zod.number().int().nonnegative().finite());

  // Only object schemas get "where" support.
  const isObjectSchema = schema instanceof zod.ZodObject;

  const whereSchema = isObjectSchema
    ? createPrismaWhereSchema(schema as any) // keep your existing recursive builder
    : zod.never(); // not used; also prevents people from sending "where" for arrays

  const dataSchema = isObjectSchema
    ? partialData
      ? (schema as any).partial().optional()
      : (schema as any).optional()
    : schema.optional(); // arrays: allow full array

  const querySchema = zod
    .object({
      data: dataSchema,

      // keep your query envelope fields
      skip: numericQueryValue.default(0).optional(),
      limit: numericQueryValue.default(10).optional(),
      take: numericQueryValue.optional(),
      cursor: NonEmptyCursorMap.optional(),

      // only valid for object schemas
      where: isObjectSchema ? whereSchema.optional() : zod.undefined().optional(),

      orderBy: zod
        .record(zod.enum(['asc', 'desc']))
        .refine((value) => Object.keys(value).length > 0, {
          message: 'orderBy must include at least one field',
        })
        .refine((value) => hasStrictFieldNames(value), {
          message: 'orderBy field names must be non-empty and trimmed',
        })
        .optional(),
      include: NonEmptyBooleanMap.optional(),
      select: NonEmptyBooleanMap.optional(),
    })
    .partial()
    .superRefine((query, ctx) => {
      if (query.include !== undefined && query.select !== undefined) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'include and select cannot be combined',
          path: ['select'],
        });
      }
    })
    .transform((query) => {
      if (query.take !== undefined && query.limit === undefined) {
        return { ...query, limit: query.take };
      }

      return query;
    });

  return zod.union([querySchema, zod.undefined()]);
};

export type inferQuery<T extends zod.ZodRawShape> = zod.infer<ReturnType<typeof createPrismaWhereSchema<T>>>;

export type GetInferenceHelpers<
  TType extends 'input' | 'output',
  TRoot extends AnyTRPCClientTypes,
  TRecord extends TRPCRouterRecord,
> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends TRPCRouterRecord
      ? GetInferenceHelpers<TType, TRoot, $Value>
      : $Value extends AnyProcedure
        ? inferProcedureOutput<$Value> // inferTransformedProcedureOutput<TRoot, $Value>
        : never
    : never;
};

export type inferRouterOutputs<TRouter extends AnyRouter> = GetInferenceHelpers<
  'output',
  TRouter['_def']['_config']['$types'],
  TRouter['_def']['record']
>;

// type SpecificOutput = Router['_def']['record']['createInterfaceDraft']['_def']['$types']['output'];
// type TestOutput = RouterOutput['createInterfaceDraft'];
