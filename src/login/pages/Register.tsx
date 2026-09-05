import type { JSX } from "keycloakify/tools/JSX";
import { useLayoutEffect, useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, Checkbox, Typography } from "@okkly/react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
  doMakeUserConfirmPassword: boolean;
};

type RecaptchaWindow = Window & { onSubmitRecaptcha?: () => void };

export default function Register(props: RegisterProps) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
  } = kcContext;

  const { msg, advancedMsg } = i18n;
  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);

  useLayoutEffect(() => {
    const recaptchaWindow = window as RecaptchaWindow;
    recaptchaWindow.onSubmitRecaptcha = () => {
      (document.getElementById("kc-register-form") as HTMLFormElement | null)?.requestSubmit();
    };

    return () => {
      delete recaptchaWindow.onSubmitRecaptcha;
    };
  }, []);

  const recaptchaInvisible =
    recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
      displayMessage={messagesPerField.exists("global")}
      displayRequiredFields
    >
      <form
        id="kc-register-form"
        className="iam-form"
        action={url.registrationAction}
        method="post"
      >
        <div className="iam-register-fields">
          <UserProfileFormFields
            kcContext={kcContext}
            i18n={i18n}
            kcClsx={kcClsx}
            onIsFormSubmittableValueChange={setIsFormSubmittable}
            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
          />
        </div>

        {termsAcceptanceRequired && (
          <div className="iam-form">
            <Typography variant="label-md">{msg("termsTitle")}</Typography>
            <Typography variant="body-sm" color="muted">
              {msg("termsText")}
            </Typography>
            <Checkbox
              id="termsAccepted"
              name="termsAccepted"
              checked={areTermsAccepted}
              onChange={(_, checked) => setAreTermsAccepted(checked)}
              label={msg("acceptTerms")}
              aria-invalid={messagesPerField.existsError("termsAccepted") || undefined}
            />
            {messagesPerField.existsError("termsAccepted") && (
              <Typography variant="caption" color="danger">
                <span
                  dangerouslySetInnerHTML={{
                    __html: kcSanitize(messagesPerField.get("termsAccepted")),
                  }}
                />
              </Typography>
            )}
          </div>
        )}

        {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
          <div
            className="g-recaptcha"
            data-size="compact"
            data-sitekey={recaptchaSiteKey}
            data-action={recaptchaAction}
          />
        )}

        <div className="iam-form__actions">
          {recaptchaInvisible ? (
            <Button
              className="g-recaptcha iam-submit"
              type="submit"
              fullWidth
              data-sitekey={recaptchaSiteKey}
              data-callback="onSubmitRecaptcha"
              data-action={recaptchaAction}
            >
              {msg("doRegister")}
            </Button>
          ) : (
            <Button
              type="submit"
              className="iam-submit"
              fullWidth
              disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
            >
              {msg("doRegister")}
            </Button>
          )}
          <a className="iam-link" href={url.loginUrl}>
            {msg("backToLogin")}
          </a>
        </div>
      </form>
    </Template>
  );
}
