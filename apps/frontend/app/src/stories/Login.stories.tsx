
import type { Meta, StoryObj } from "@storybook/react";
import Login from "../pages/Login";



const meta: Meta<typeof Login> = {
  title: "Components/Login",
  component: Login,
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Default: Story = {};
