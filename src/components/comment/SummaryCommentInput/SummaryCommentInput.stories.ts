import type { Meta, StoryObj } from '@storybook/react';
import SummaryCommentInput from './SummaryCommentInput';

const meta = {
  title: 'Components/Comment/SummaryCommentInput',
  component: SummaryCommentInput,
} satisfies Meta<typeof SummaryCommentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    clickInputButton: async () => {},
    setCommentValue: () => {},
  },
};
