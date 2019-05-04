import * as assert from 'assert';

// @types/mysql QueryOptions
type QueryOptions = {
  sql: string;
  values: unknown[];
};

const brand = Symbol('sql-brand');

interface InterpolationResult extends QueryOptions {
  [brand]: typeof brand;
}

function isInterpolationResult(x: unknown): x is InterpolationResult {
  return typeof x === 'object' && (x as any)[brand] === brand;
}

export function sql(
  strings: TemplateStringsArray,
  ...keys: unknown[]
): InterpolationResult {
  const sqlParts: string[] = [];
  const values: unknown[] = [];

  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    if (isInterpolationResult(key)) {
      sqlParts.push(strings[i], key.sql);
      values.push(...key.values);
    } else {
      sqlParts.push(strings[i], '?');
      values.push(key);
    }
  }

  sqlParts.push(strings[keys.length]);

  return {
    values,
    [brand]: brand,
    sql: sqlParts.join(''),
  };
}

sql.empty = sql``;

assert.deepStrictEqual(sql`lorem ipsum sql`, {
  [brand]: brand,
  sql: `lorem ipsum sql`,
  values: [],
});

assert.deepStrictEqual(
  sql`SELECT * FROM \`groups\` WHERE parent_group = ${2}`,
  {
    [brand]: brand,
    sql: `SELECT * FROM \`groups\` WHERE parent_group = ?`,
    values: [2],
  }
);

// nested
const groupId = 12;

const actual = sql`
    SELECT t.*
    FROM tasks t
    ${
      groupId
        ? // tslint:disable-next-line:no-nested-template-literals
          sql`JOIN group_has_task ght
        ON (t.id = ght.task_id)
        WHERE ght.group_id = ${groupId}`
        : ''
    }
    ORDER BY created_at DESC`;

const expected = {
  [brand]: brand,
  sql: `
    SELECT t.*
    FROM tasks t
    ${
      groupId
        ? // tslint:disable-next-line:no-nested-template-literals
          `JOIN group_has_task ght
        ON (t.id = ght.task_id)
        WHERE ght.group_id = ?`
        : ''
    }
    ORDER BY created_at DESC`,
  values: groupId ? [groupId] : [],
};

assert.deepStrictEqual(actual, expected);
