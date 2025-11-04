
import type { Meta, StoryObj } from "@storybook/react";
import Register from "../pages/Register";


const meta: Meta<typeof Register> = {
  title: "Components/Register",
  component: Register,
};

export default meta;

type Story = StoryObj<typeof Register>;

export const Default: Story = {};
