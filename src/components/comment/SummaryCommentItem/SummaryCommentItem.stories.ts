import type { Meta, StoryObj } from '@storybook/react';
import SummaryCommentItem from './SummaryCommentItem';

const meta = {
  title: 'Components/Comment/SummaryCommentItem',
  component: SummaryCommentItem,
} satisfies Meta<typeof SummaryCommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    comment: '댓글입니다.',
    createdAt: '2023-10-18T15:00:00.000Z',
    isMy: true,
    userImage: '',
    userName: '수리마수리',
    id: 0,
    userId: ''
  },
};
