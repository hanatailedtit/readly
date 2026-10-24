const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
// Run the pure TypeScript helpers with the repository's compiler on Node 20+.
const records = {};
const source = fs.readFileSync(
  require.resolve("../src/lib/records.ts"),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});
new Function("exports", outputText)(records);
const {
  groupBooks,
  pageRangeError,
  recordTitle,
  safeExternalUrl,
  safeReturnPath,
  categoryKeyword,
  formatDate,
} = records;

test("groups repeated records by ISBN while keeping editions and unknown books separate", () => {
  const item = {
    bookTitle: "소년이 온다",
    bookAuthor: "한강",
    isbn: "9788936434120",
  };
  const result = groupBooks([
    { ...item, id: 1 },
    { ...item, id: 2 },
    { ...item, id: 3, isbn: "other-edition" },
    { ...item, id: 4, isbn: "", bookTitle: "다른 책" },
  ]);
  assert.deepEqual(
    result.map((book) => book.count),
    [2, 1, 1],
  );
  assert.deepEqual(
    result[0].records.map((record) => record.id),
    [1, 2],
  );
});
test("rejects missing, fractional, negative and reversed page ranges", () => {
  for (const [start, end] of [
    ["1", ""],
    ["", "2"],
    ["1.5", "3"],
    ["-1", "3"],
    ["9", "2"],
    ["0", "4"],
  ])
    assert.ok(pageRangeError(start, end, false));
  assert.equal(pageRangeError("12", "12", false), "");
  assert.equal(pageRangeError("", "", false), "");
  assert.equal(pageRangeError("20", "3", true), "");
});
test("derives a readable title from legacy HTML and falls back for empty records", () => {
  assert.equal(
    recordTitle({
      content: "<h2>책 &amp; 마음</h2><p>본문</p>",
      bookTitle: "책",
    }),
    "책 & 마음",
  );
  assert.equal(
    recordTitle({ content: "<p><br></p>", bookTitle: "아몬드" }),
    "아몬드 · 독서 기록",
  );
  assert.equal(
    recordTitle({ content: "가".repeat(100), bookTitle: "책" }).length,
    80,
  );
});
test("rejects executable links while preserving valid external links", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.example",
    "not a URL",
  ])
    assert.equal(safeExternalUrl(value), undefined);
  assert.equal(
    safeExternalUrl("https://example.com/book?a=1"),
    "https://example.com/book?a=1",
  );
});
test("login return path stays on this application", () => {
  for (const value of [
    null,
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/\n/evil.example",
  ])
    assert.equal(safeReturnPath(value), "/");
  assert.equal(
    safeReturnPath("/summary/create?isbn=123"),
    "/summary/create?isbn=123",
  );
});
test("category searches preserve the backend JSON array contract", () => {
  assert.equal(categoryKeyword("소설"), '["소설"]');
  assert.equal(categoryKeyword('["소설","에세이"]'), '["소설","에세이"]');
  assert.equal(categoryKeyword('{"bad":1}'), '["{\\"bad\\":1}"]');
});
test("publication dates support the catalog date format and invalid dates", () => {
  assert.ok(formatDate("20241024").includes("2024"));
  assert.equal(formatDate("invalid"), "");
});
