import { Suspense } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import UserProfileFormFields from "./components/UserProfileFormFields";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginResetPassword from "./pages/LoginResetPassword";
import LoginOtp from "./pages/LoginOtp";
import Error from "./pages/Error";

const doMakeUserConfirmPassword = true;
const doUseDefaultCss = false;

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;
  const { i18n } = useI18n({ kcContext });

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case "login.ftl":
            return (
              <Login
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={doUseDefaultCss}
              />
            );
          case "register.ftl":
            return (
              <Register
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={doUseDefaultCss}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
          case "login-reset-password.ftl":
            return (
              <LoginResetPassword
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={doUseDefaultCss}
              />
            );
          case "login-otp.ftl":
            return (
              <LoginOtp
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={doUseDefaultCss}
              />
            );
          case "error.ftl":
            return (
              <Error
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={doUseDefaultCss}
              />
            );
          default:
            return (
              <DefaultPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={doUseDefaultCss}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
        }
      })()}
    </Suspense>
  );
}

const classes = {} satisfies { [key in ClassKey]?: string };
