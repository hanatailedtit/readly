import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
const meta = {
  title: "Readly/Button",
  component: Button,
  parameters: { layout: "centered" },
  args: { children: "기록 남기기" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Outline: Story = {
  args: { variant: "outline", children: "독서 기록 목록으로" },
};
export const Disabled: Story = {
  args: { disabled: true, children: "저장 중…" },
};
