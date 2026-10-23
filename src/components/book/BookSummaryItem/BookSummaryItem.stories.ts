import type { Meta, StoryObj } from '@storybook/react';
import BookSummaryItem from './BookSummaryItem';

const meta = {
  title: 'Components/Book/BookSummaryItem',
  component: BookSummaryItem,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BookSummaryItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content:
      '<h1>요약</h1> <p>인간은 혼자 있을 때만 온전히 그 자신일 수 있다. 그러므로 고독을 사랑하지 않는 자는 자유도 사랑하지 않는 자라고 할 수 있다.</p> <p>그래서 쇼펜하우어는 이 세계의 본질이 합리성이 아니라 ‘삶에의 의지’라고 말했다.</p>',
    bookTitle: '마흔에 읽는 쇼펜하우어',
    bookAuthor: '강용수',
    userImage: '',
    userName: 'surimasuri',
    startPage: 1,
    endPage: 100,
    createAt: '2023-10-18T15:00:00.000Z',
    id: 0,
    category: '철학',
    userId: '',
  },
};
