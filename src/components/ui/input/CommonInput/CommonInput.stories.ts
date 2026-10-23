import type { Meta, StoryObj } from '@storybook/react';
import CommonInput from './CommonInput';

const meta = {
  title: 'UI/Input/CommonInput',
  component: CommonInput,
  parameters: {
    layout: 'centered',
  },

} satisfies Meta<typeof CommonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChangeValue: () => { }
  },
};
