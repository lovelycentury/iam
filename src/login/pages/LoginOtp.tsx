import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, Radio, TextField } from "@okkly/react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { otpLogin, url, messagesPerField } = kcContext;
  const { msg } = i18n;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpError = messagesPerField.existsError("totp");

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!otpError}
      headerNode={msg("doLogIn")}
    >
      <form
        id="kc-otp-login-form"
        className="iam-form"
        action={url.loginAction}
        method="post"
        onSubmit={() => {
          setIsSubmitting(true);
          return true;
        }}
      >
        {otpLogin.userOtpCredentials.length > 1 && (
          <div className="iam-otp-list">
            {otpLogin.userOtpCredentials.map((otpCredential, index) => (
              <Radio
                key={otpCredential.id}
                id={`kc-otp-credential-${index}`}
                name="selectedCredentialId"
                value={otpCredential.id}
                defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                label={otpCredential.userLabel}
              />
            ))}
          </div>
        )}

        <TextField
          id="otp"
          name="otp"
          label={msg("loginOtpOneTime")}
          autoComplete="one-time-code"
          autoFocus
          error={otpError}
          helperText={
            otpError ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: kcSanitize(messagesPerField.get("totp")),
                }}
              />
            ) : undefined
          }
          fullWidth
          aria-invalid={otpError || undefined}
        />

        <Button
          type="submit"
          name="login"
          id="kc-login"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {msg("doLogIn")}
        </Button>
      </form>
    </Template>
  );
}
