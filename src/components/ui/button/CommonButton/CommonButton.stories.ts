import type { Meta, StoryObj } from '@storybook/react';
import CommonButton from './CommonButton';

const meta = {
  title: 'UI/Button/CommonButton',
  component: CommonButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'red', 'outline', 'ghost', 'link'] },
  },
} satisfies Meta<typeof CommonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};
