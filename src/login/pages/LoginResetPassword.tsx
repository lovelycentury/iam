import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, TextField } from "@okkly/react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginResetPassword(
  props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, realm, auth, messagesPerField } = kcContext;
  const { msg } = i18n;
  const usernameError = messagesPerField.existsError("username");

  const usernameLabel = !realm.loginWithEmailAllowed
    ? msg("username")
    : !realm.registrationEmailAsUsername
      ? msg("usernameOrEmail")
      : msg("email");

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo
      displayMessage={!usernameError}
      infoNode={
        realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")
      }
      headerNode={msg("emailForgotTitle")}
    >
      <form id="kc-reset-password-form" className="iam-form" action={url.loginAction} method="post">
        <TextField
          type="text"
          id="username"
          name="username"
          label={usernameLabel}
          autoFocus
          defaultValue={auth.attemptedUsername ?? ""}
          error={usernameError}
          helperText={
            usernameError ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: kcSanitize(messagesPerField.get("username")),
                }}
              />
            ) : undefined
          }
          fullWidth
          aria-invalid={usernameError || undefined}
        />
        <div className="iam-form__actions">
          <Button type="submit" fullWidth>
            {msg("doSubmit")}
          </Button>
          <a className="iam-link" href={url.loginUrl}>
            {msg("backToLogin")}
          </a>
        </div>
      </form>
    </Template>
  );
}
