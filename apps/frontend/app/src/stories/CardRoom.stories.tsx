import type { Meta, StoryObj } from "@storybook/react";
import type { Room } from "../features/rooms/types/Room.interface";
import CardRoom from "../components/CardRoom";

const roomExample: Room = {
  id: "1",
  number: 101,
  type: "single",
  price: 100,
  available: true,
};

const meta: Meta<typeof CardRoom> = {
  title: "Components/CardRoom",
  component: CardRoom,
};

export default meta;

type Story = StoryObj<typeof CardRoom>;

export const Default: Story = {
  args: {
    room: roomExample,
  },
};
