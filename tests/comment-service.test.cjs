require("./helpers/typescript.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const queryHook = require("./helpers/query-hook.cjs");
const { createQueryClient } = require("../src/lib/react-query.ts");
const { readlyApiAxiosInstance } = require("../src/api/readly-api.ts");
const { useEditSummaryCommentMutation } = require("../src/service/comment.service.ts");
const { COMMENT_KEY, BOOK_SUMMARY_KEY } = require("../src/constants/query-key.constants.ts");

test("editing a comment sends only its ID and content and refreshes only its record's comments", async () => {
  const client = createQueryClient();
  const keys = [[COMMENT_KEY, 1], [COMMENT_KEY, 2], [BOOK_SUMMARY_KEY, "feed", 1]];
  keys.forEach(key => client.setQueryData(key, { total: 2, list: [] }));
  readlyApiAxiosInstance().defaults.adapter = async config => {
    assert.equal(config.method, "put");
    assert.equal(config.url, "/comment/edit");
    assert.deepEqual(JSON.parse(config.data), { id: 11, comment: "수정한 댓글" });
    return { data: "Success edited.", status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    await queryHook(() => useEditSummaryCommentMutation(1), client)
      .mutateAsync({ id: 11, comment: "수정한 댓글" });
    assert.equal(client.getQueryState(keys[0]).isInvalidated, true);
    for (const key of keys.slice(1)) assert.equal(client.getQueryState(key).isInvalidated, false);
    assert.equal(client.getQueryData(keys[0]).total, 2);
  } finally {
    client.clear();
  }
});

test("failed comment edits leave cached comments untouched and allow a retry", async () => {
  const client = createQueryClient();
  const key = [COMMENT_KEY, 1];
  const original = { total: 1, list: [{ id: 11, comment: "기존 댓글" }] };
  client.setQueryData(key, original);
  let attempts = 0;
  readlyApiAxiosInstance().defaults.adapter = async config => {
    if (++attempts === 1) throw new Error("Save failed");
    return { data: "Success edited.", status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    const mutation = queryHook(() => useEditSummaryCommentMutation(1), client);
    const draft = { id: 11, comment: "다시 저장할 댓글" };
    await assert.rejects(mutation.mutateAsync(draft), /Save failed/);
    assert.deepEqual(client.getQueryData(key), original);
    assert.equal(client.getQueryState(key).isInvalidated, false);
    await mutation.mutateAsync(draft);
    assert.equal(attempts, 2);
    assert.equal(client.getQueryState(key).isInvalidated, true);
  } finally {
    client.clear();
  }
});
