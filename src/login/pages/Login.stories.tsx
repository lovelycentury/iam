import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
  title: "IAM/Login",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const googleProvider = {
  loginUrl: "google",
  alias: "google",
  providerId: "google",
  displayName: "Google",
  iconClasses: "fa fa-google",
};

const githubProvider = {
  loginUrl: "github",
  alias: "github",
  providerId: "github",
  displayName: "GitHub",
  iconClasses: "fa fa-github",
};

export const Default: Story = {
  parameters: {
    viewport: { defaultViewport: "iamDesktop" },
  },
  render: () => <KcPageStory />,
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "iamMobile" },
  },
  render: () => <KcPageStory />,
};

export const WithInvalidCredential: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        login: { username: "johndoe" },
        messagesPerField: {
          existsError: (fieldName: string, ...otherFieldNames: string[]) => {
            const fieldNames = [fieldName, ...otherFieldNames];
            return fieldNames.includes("username") || fieldNames.includes("password");
          },
          get: (fieldName: string) =>
            fieldName === "username" || fieldName === "password"
              ? "Invalid username or password."
              : "",
        },
      }}
    />
  ),
};

export const WithoutRegistration: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: { registrationAllowed: false },
      }}
    />
  ),
};

export const WithoutRememberMe: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: { rememberMe: false },
      }}
    />
  ),
};

export const WithoutPasswordReset: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: { resetPasswordAllowed: false },
      }}
    />
  ),
};

export const WithEmailAsUsername: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: { loginWithEmailAllowed: false },
      }}
    />
  ),
};

export const WithPresetUsername: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        login: { username: "max.mustermann@mail.com" },
      }}
    />
  ),
};

export const WithImmutablePresetUsername: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        auth: {
          attemptedUsername: "max.mustermann@mail.com",
          showUsername: true,
        },
        usernameHidden: true,
        message: {
          type: "info",
          summary: "Please re-authenticate to continue",
        },
      }}
    />
  ),
};

export const WithSocialProviders: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        social: {
          displayInfo: true,
          providers: [googleProvider, githubProvider],
        },
      }}
    />
  ),
};

export const WithErrorMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          summary:
            "The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.",
          type: "error",
        },
      }}
    />
  ),
};

export const WithPasskey: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        enableWebAuthnConditionalUI: true,
      }}
    />
  ),
};
