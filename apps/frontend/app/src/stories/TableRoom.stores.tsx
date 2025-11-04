import type { Meta, StoryObj } from "@storybook/react";
import TableRoom from "../components/TableRoom";


const meta: Meta<typeof TableRoom> = {
  title: "Components/TableRoom",
  component: TableRoom,
};

export default meta;

type Story = StoryObj<typeof TableRoom>;

export const Default: Story = {};
