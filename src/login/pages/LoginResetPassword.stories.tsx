import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });

const meta = {
  title: "IAM/LoginResetPassword",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KcPageStory />,
};

export const WithEmailAsUsername: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: {
          loginWithEmailAllowed: true,
          registrationEmailAsUsername: true,
        },
      }}
    />
  ),
};

export const WithUsernameError: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: {
          loginWithEmailAllowed: false,
          registrationEmailAsUsername: false,
          duplicateEmailsAllowed: false,
        },
        messagesPerField: {
          existsError: (field: string) => field === "username",
          get: () => "Invalid username",
        },
        auth: {
          attemptedUsername: "invalid_user",
        },
      }}
    />
  ),
};
