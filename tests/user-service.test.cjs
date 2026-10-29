require("./helpers/typescript.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const queryHook = require("./helpers/query-hook.cjs");
const axios = require("axios");
const { createQueryClient } = require("../src/lib/react-query.ts");
const { readlyApiAxiosInstance } = require("../src/api/readly-api.ts");
const {
  useEditUserNicknameMutation,
  useEditUserProfileImageMutation,
} = require("../src/service/user.service.ts");
const {
  getUserInfoData,
  getUserMyInfoData,
} = require("../src/repository/user.repository.ts");
const {
  BOOK_SUMMARY_KEY,
  BOOK_INFO_KEY,
  COMMENT_KEY,
  MY_USERS_QUERY_KEY,
  USERS_QUERY_KEY,
} = require("../src/constants/query-key.constants.ts");

for (const [name, hook, input] of [
  ["nickname", useEditUserNicknameMutation, { nickname: "새닉네임" }],
  ["image", useEditUserProfileImageMutation, new FormData()],
]) {
  test(`updating ${name} refreshes author information in comments and records`, async () => {
    const client = createQueryClient();
    const keys = [
      [USERS_QUERY_KEY, "reader"],
      [MY_USERS_QUERY_KEY],
      [BOOK_SUMMARY_KEY, "feed", 1],
      [COMMENT_KEY, 1],
    ];
    for (const key of [...keys, [BOOK_INFO_KEY, "isbn"]]) {
      client.setQueryData(key, { nickname: "기존닉네임" });
    }
    readlyApiAxiosInstance().defaults.adapter = async (config) => ({
      data: {}, status: 200, statusText: "OK", headers: {}, config,
    });
    try {
      await queryHook(hook, client).mutateAsync(input);
      for (const key of keys) {
        assert.equal(client.getQueryState(key).isInvalidated, true, JSON.stringify(key));
      }
      assert.equal(client.getQueryState([BOOK_INFO_KEY, "isbn"]).isInvalidated, false);
    } finally {
      client.clear();
    }
  });
}

test("profile requests can be canceled after the HTTP adapter starts", async () => {
  for (const fetch of [
    (signal) => getUserInfoData("reader", signal),
    (signal) => getUserMyInfoData(signal),
  ]) {
    const controller = new AbortController();
    let complete;
    readlyApiAxiosInstance().defaults.adapter = (config) => new Promise((resolve, reject) => {
      complete = () => resolve({
        data: { id: "reader" }, status: 200, statusText: "OK", headers: {}, config,
      });
      config.signal?.addEventListener("abort", () => {
        reject(new axios.CanceledError("canceled"));
      }, { once: true });
    });
    const canceled = assert.rejects(fetch(controller.signal), (error) => axios.isCancel(error));
    await new Promise(setImmediate);
    controller.abort();
    complete();
    await canceled;
  }
});
