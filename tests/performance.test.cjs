require("./helpers/typescript.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const axios = require("axios");
const { readlyApiAxiosInstance } = require("../src/api/readly-api.ts");
const {
  getBookSummaryList,
  getSearchBookSummaryList,
  getRecordsForBook,
} = require("../src/repository/book.repository.ts");
const { createQueryClient } = require("../src/lib/react-query.ts");
const {
  isSessionQuery,
  BOOK_SUMMARY_KEY,
  BOOK_SUMMARY_LIKE_KEY,
  COMMENT_KEY,
  MY_USERS_QUERY_KEY,
} = require("../src/constants/query-key.constants.ts");
const {
  toSummaryCommentListModel,
} = require("../src/model/comment/comment.dto.ts");
const client = readlyApiAxiosInstance();
const respond = (data, config) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});
const book = { title: "소년이 온다", author: "한강", isbn: "target-isbn" };

test("reuses the HTTP client but reads the current token for each request", async () => {
  const auth = [];
  client.defaults.adapter = async (config) => {
    auth.push(config.headers.get("Authorization"));
    assert.equal(config.timeout, 15000);
    return respond({}, config);
  };
  global.document = { cookie: "access_token=first-token" };
  await client.get("/check");
  document.cookie = "access_token=second-token";
  await client.get("/check");
  document.cookie = "";
  await client.get("/check");
  delete global.document;
  assert.strictEqual(readlyApiAxiosInstance(), client);
  assert.deepEqual(auth, [
    "Bearer first-token",
    "Bearer second-token",
    undefined,
  ]);
});
test("normalizes the legacy empty-array list response", async () => {
  client.defaults.adapter = async (config) => respond([], config);
  assert.deepEqual(await getBookSummaryList({}), {
    total: 0,
    list: [],
    nextOffset: null,
  });
  assert.deepEqual(
    await getSearchBookSummaryList({ type: "title", keyword: "없음" }),
    { total: 0, list: [], nextOffset: null },
  );
});
test("book records search pages by title, filters other editions and ignores incorrect category totals", async () => {
  const records = Array.from({ length: 205 }, (_, index) => ({
    id: index + 1,
    book_title: book.title,
    book_author: "한강",
    isbn: index % 2 === 0 ? book.isbn : "different-edition",
  }));
  const calls = [];
  client.defaults.adapter = async (config) => {
    calls.push(config.params);
    assert.equal(config.url, "/book/summary/search");
    return respond(
      {
        total: 1,
        list: records.slice(config.params.offset, config.params.offset + 100),
        nextOffset: null,
      },
      config,
    );
  };
  const result = await getRecordsForBook(book);
  assert.equal(result.length, 103);
  assert.deepEqual(
    calls.map((c) => c.offset),
    [0, 100, 200],
  );
  assert.ok(calls.every((c) => c.keyword === book.title && c.type === "title"));
  assert.ok(result.every((record) => record.isbn === book.isbn));
});
test("stops a repeating server page and deduplicates IDs", async () => {
  const records = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    book_title: book.title,
    book_author: book.author,
    isbn: book.isbn,
  }));
  let calls = 0;
  client.defaults.adapter = async (config) => {
    calls++;
    return respond({ total: 999, list: records, nextOffset: 1 }, config);
  };
  assert.equal((await getRecordsForBook(book)).length, 100);
  assert.equal(calls, 2);
});
test("cancels an unused API request through AbortSignal", async () => {
  const controller = new AbortController();
  client.defaults.adapter = (config) =>
    new Promise((resolve, reject) => {
      config.signal.addEventListener(
        "abort",
        () => reject(new axios.CanceledError("canceled")),
        { once: true },
      );
      controller.abort();
    });
  await assert.rejects(getBookSummaryList({}, controller.signal), (error) =>
    axios.isCancel(error),
  );
});
test("fresh queries share data while client errors are not retried", async () => {
  const cache = createQueryClient();
  let count = 0;
  const options = { queryKey: ["repeat"], queryFn: async () => ++count };
  assert.equal(await cache.fetchQuery(options), 1);
  assert.equal(await cache.fetchQuery(options), 1);
  assert.equal(count, 1);
  let errors = 0;
  await assert.rejects(
    cache.fetchQuery({
      queryKey: ["unauthorized"],
      retryDelay: 0,
      queryFn: async () => {
        errors++;
        throw new axios.AxiosError(
          "unauthorized",
          "ERR_BAD_REQUEST",
          undefined,
          undefined,
          { status: 401 },
        );
      },
    }),
  );
  assert.equal(errors, 1);
  assert.notStrictEqual(createQueryClient(), cache);
  cache.clear();
});
test("session invalidation excludes public feeds and the full catalog", () => {
  for (const key of [
    [BOOK_SUMMARY_KEY, "catalog"],
    [BOOK_SUMMARY_KEY, "feed", 1],
    [BOOK_SUMMARY_KEY, "monthly", 2026, 10],
  ])
    assert.equal(isSessionQuery({ queryKey: key }), false);
  for (const key of [
    [MY_USERS_QUERY_KEY],
    [COMMENT_KEY, 1],
    [BOOK_SUMMARY_LIKE_KEY, 1],
    [BOOK_SUMMARY_KEY, 1],
  ])
    assert.equal(isSessionQuery({ queryKey: key }), true);
});
test("groups replies in a single traversal, preserving order and replies preceding parents", () => {
  const item = (id, parent) => ({
    id,
    comment_id: parent,
    comment: String(id),
    user_id: "reader",
    user_name: "독자",
    created_at: "2026-10-25",
    is_my: false,
    user_image: "",
  });
  const result = toSummaryCommentListModel([
    item(3, 1),
    item(1, null),
    item(2, null),
    item(4, 1),
    item(5, 999),
  ]);
  assert.deepEqual(
    result.map((x) => x.id),
    [1, 2],
  );
  assert.deepEqual(
    result[0].reply.map((x) => x.id),
    [3, 4],
  );
  assert.deepEqual(result[1].reply, []);
  const many = Array.from({ length: 10000 }, (_, i) =>
    item(i + 1, i % 2 === 0 ? null : i),
  );
  const grouped = toSummaryCommentListModel(many);
  assert.equal(grouped.length, 5000);
  assert.ok(grouped.every((parent) => parent.reply.length === 1));
});
