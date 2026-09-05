import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-otp.ftl" });

const meta = {
  title: "IAM/LoginOtp",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KcPageStory />,
};

export const MultipleOtpCredentials: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        otpLogin: {
          userOtpCredentials: [
            { id: "credential1", userLabel: "Device 1" },
            { id: "credential2", userLabel: "Device 2" },
            { id: "credential3", userLabel: "Device 3" },
          ],
          selectedCredentialId: "credential1",
        },
        messagesPerField: {
          existsError: () => false,
        },
      }}
    />
  ),
};

export const WithOtpError: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        otpLogin: {
          userOtpCredentials: [],
        },
        messagesPerField: {
          existsError: (field: string) => field === "totp",
          get: () => "Invalid OTP code",
        },
      }}
    />
  ),
};

export const WithErrorAndMultipleOtpCredentials: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        otpLogin: {
          userOtpCredentials: [
            { id: "credential1", userLabel: "Device 1" },
            { id: "credential2", userLabel: "Device 2" },
          ],
          selectedCredentialId: "credential1",
        },
        messagesPerField: {
          existsError: (field: string) => field === "totp",
          get: () => "Invalid OTP code",
        },
      }}
    />
  ),
};
