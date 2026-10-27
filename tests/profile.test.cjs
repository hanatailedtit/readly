require("./helpers/typescript.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readlyApiAxiosInstance } = require("../src/api/readly-api.ts");
const { getUserRecords } = require("../src/repository/book.repository.ts");
const { filterProfileRecords } = require("../src/lib/profile.ts");

test("profile records fetch every user-scoped page and ignore a legacy nextOffset", async () => {
  const client = readlyApiAxiosInstance();
  const records = Array.from({ length: 145 }, (_, i) => ({
    id: i + 1,
    user_id: "reader",
  }));
  records[120] = { id: 121, user_id: "another-reader" };
  const offsets = [];
  client.defaults.adapter = async (config) => {
    assert.equal(config.url, "/book/summary/list");
    assert.equal(config.params.user_id, "reader");
    offsets.push(config.params.offset);
    return {
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: {
        total: records.length,
        nextOffset: null,
        list: records.slice(config.params.offset, config.params.offset + 100),
      },
    };
  };
  assert.equal((await getUserRecords("reader")).length, 144);
  assert.deepEqual(offsets, [0, 100]);
  assert.deepEqual(await getUserRecords(""), []);
});

test("profile records stop duplicate pages instead of loading forever", async () => {
  const client = readlyApiAxiosInstance();
  let calls = 0;
  client.defaults.adapter = async (config) => {
    calls++;
    return {
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: {
        total: 900,
        nextOffset: 1,
        list: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          user_id: "reader",
        })),
      },
    };
  };
  assert.equal((await getUserRecords("reader")).length, 100);
  assert.equal(calls, 2);
});

const records = [
  {
    id: 1,
    bookTitle: "같은 책",
    bookAuthor: "작가",
    isbn: "edition-a",
    content: "<p>먼저 남긴 생각</p>",
    createAt: "2026-10-01",
    likeCount: 8,
    viewCount: 1,
  },
  {
    id: 2,
    bookTitle: "같은 책",
    bookAuthor: "작가",
    isbn: "edition-b",
    content: "<p>끝에서 찾은 <strong>마음</strong></p>",
    createAt: "2026-10-03",
    likeCount: 1,
    viewCount: 20,
  },
  {
    id: 3,
    bookTitle: "다른 책",
    bookAuthor: "작가",
    isbn: "other",
    content: "<p>Readly &amp; Books</p>",
    createAt: "2026-10-02",
    likeCount: 4,
    viewCount: 5,
  },
];
const options = { book: "", keyword: "", order: "desc" };
test("profile search covers all records and intersects book editions", () => {
  assert.deepEqual(
    filterProfileRecords(records, {
      ...options,
      keyword: "끝에서 찾은 마음",
    }).map((r) => r.id),
    [2],
  );
  assert.deepEqual(
    filterProfileRecords(records, {
      ...options,
      keyword: "readly & books",
    }).map((r) => r.id),
    [3],
  );
  assert.deepEqual(
    filterProfileRecords(records, {
      ...options,
      keyword: "같은 책",
      book: "edition-a",
    }).map((r) => r.id),
    [1],
  );
  assert.deepEqual(
    filterProfileRecords(records, {
      ...options,
      keyword: "끝에서",
      book: "edition-a",
    }),
    [],
  );
});
test("profile sorting preserves source order and supports all existing sort choices", () => {
  for (const [order, ids] of [
    ["desc", [2, 3, 1]],
    ["asc", [1, 3, 2]],
    ["like", [1, 3, 2]],
    ["view", [2, 3, 1]],
  ])
    assert.deepEqual(
      filterProfileRecords(records, { ...options, order }).map((r) => r.id),
      ids,
    );
  assert.deepEqual(
    records.map((r) => r.id),
    [1, 2, 3],
  );
});
