import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "error.ftl" });

const meta = {
  title: "IAM/Error",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KcPageStory />,
};

export const WithAnotherMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: { summary: "With another error message" },
      }}
    />
  ),
};

export const WithHtmlErrorMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          summary:
            "<strong>Error:</strong> Something went wrong. <a href='https://example.com'>Go back</a>",
        },
      }}
    />
  ),
};

export const WithBackToApplication: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: { summary: "An error occurred" },
        skipLink: false,
        client: {
          baseUrl: "https://example.com",
        },
      }}
    />
  ),
};
