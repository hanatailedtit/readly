const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { QueryClientProvider } = require("@tanstack/react-query");

// 실제 QueryClient로 훅의 반환값과 Mutation 부수 효과를 DOM 없이 검증한다.
module.exports = function queryHook(hook, client) {
  let result;
  function Probe() {
    result = hook();
    return null;
  }
  renderToStaticMarkup(
    React.createElement(QueryClientProvider, { client }, React.createElement(Probe)),
  );
  return result;
};
