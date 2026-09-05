import type { Preview } from "@storybook/react";
import "@okkly/design-system/styles/index.scss";
import "@okkly/react/style.css";
import "../src/login/iam.scss";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
    viewport: {
      viewports: {
        iamMobile: {
          name: "IAM mobile",
          styles: { width: "390px", height: "844px" },
        },
        iamDesktop: {
          name: "IAM desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
    options: {
      storySort: {
        order: ["IAM", ["Login", "Register", "LoginResetPassword", "LoginOtp", "Error"]],
      },
    },
  },
};

export default preview;
