import type { StorybookConfig } from "@storybook/nextjs";

// Storybook과 Next.js가 같은 Webpack을 사용해 플러그인 훅 충돌을 방지한다.
process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
};
export default config;
