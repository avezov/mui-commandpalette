import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { CommandPalette } from '../src/CommandPalette';

const meta = {
  title: 'CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    open: true,
    groups: [
      {
        label: 'Окна',
        name: 'window',
      },
      {
        label: 'Форточки',
        name: 'fortochka',
      },
      {
        label: 'Страницы',
        name: 'pages',
      },
    ],
    commands: [
      {
        name: 'open',
        label: 'Открыть окно',
        action: action('open'),
        group: 'window',
      },
      {
        name: 'halfopen',
        label: 'Приоткрыть окно',
        action: action('halfopen'),
        group: 'window',
      },
      {
        name: 'close',
        label: 'Закрыть окно',
        action: action('close'),
        group: 'window',
      },
      {
        name: 'closeFortochka',
        label: 'Закрыть форточку',
        action: action('closeFortochka'),
        group: 'fortochka'
      },

      {
        group: 'pages',
        label: 'Список офферов',
        name: 'offers',
        action: action('/offers'),
      },

      {
        group: 'pages',
        label: 'Авторизация',
        name: 'login',
        action: action('/login'),
      },

      {
        group: 'pages',
        label: 'Регистрация',
        name: 'registration',
        action: action('/registration/webmaster'),
      },
    ],
  },
};
