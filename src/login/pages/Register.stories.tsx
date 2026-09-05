import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
  title: "IAM/Register",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    viewport: { defaultViewport: "iamDesktop" },
  },
  render: () => <KcPageStory />,
};

export const WithEmailAlreadyExists: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        profile: {
          attributesByName: {
            username: { value: "johndoe" },
            email: { value: "john.doe@gmail.com" },
            firstName: { value: "John" },
            lastName: { value: "Doe" },
          },
        },
        messagesPerField: {
          existsError: (fieldName: string, ...otherFieldNames: string[]) =>
            [fieldName, ...otherFieldNames].includes("email"),
          get: (fieldName: string) => (fieldName === "email" ? "Email already exists." : undefined),
        },
      }}
    />
  ),
};

export const WithEmailAsUsername: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: { registrationEmailAsUsername: true },
        profile: {
          attributesByName: {
            username: undefined,
          },
        },
      }}
    />
  ),
};

export const WithTermsAcceptance: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        termsAcceptanceRequired: true,
        "x-keycloakify": {
          messages: {
            termsText: "<a href='https://example.com/terms'>Service Terms of Use</a>",
          },
        },
      }}
    />
  ),
};

export const WithTermsNotAccepted: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        termsAcceptanceRequired: true,
        messagesPerField: {
          existsError: (fieldName: string) => fieldName === "termsAccepted",
          get: (fieldName: string) =>
            fieldName === "termsAccepted" ? "You must accept the terms." : undefined,
        },
      }}
    />
  ),
};

export const WithFieldErrors: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        profile: {
          attributesByName: {
            username: { value: "" },
            email: { value: "invalid-email" },
          },
        },
        messagesPerField: {
          existsError: (fieldName: string) => ["username", "email"].includes(fieldName),
          get: (fieldName: string) => {
            if (fieldName === "username") return "Username is required.";
            if (fieldName === "email") return "Invalid email format.";
            return undefined;
          },
        },
      }}
    />
  ),
};
