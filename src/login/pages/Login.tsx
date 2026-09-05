import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import { Button, Checkbox, TextField, Typography } from "@okkly/react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { KcAlert } from "../components/KcAlert";
import { PasswordField } from "../components/PasswordField";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext;

  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const webAuthnButtonId = "authenticateWebAuthnButton";
  const fieldError = messagesPerField.existsError("username", "password");
  const fieldErrorHtml = fieldError
    ? kcSanitize(messagesPerField.getFirstError("username", "password"))
    : undefined;

  useScript({
    webAuthnButtonId,
    kcContext,
    i18n,
  });

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
      displayMessage={!fieldError}
      headerNode={msg("loginAccountTitle")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <>
          <span>{msg("noAccount")}</span>
          <a className="iam-link" tabIndex={8} href={url.registrationUrl}>
            {msg("doRegister")}
          </a>
        </>
      }
      socialProvidersNode={
        realm.password && social?.providers !== undefined && social.providers.length !== 0 ? (
          <div className="iam-social">
            <Typography variant="label-md" color="muted">
              {msg("identity-provider-login-label")}
            </Typography>
            <ul className="iam-social__list">
              {social.providers.map((p) => (
                <li key={p.alias}>
                  <Button id={`social-${p.alias}`} href={p.loginUrl} variant="secondary" fullWidth>
                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      }
    >
      {realm.password && (
        <form
          id="kc-form-login"
          className="iam-form"
          action={url.loginAction}
          method="post"
          onSubmit={() => {
            setIsLoginButtonDisabled(true);
            return true;
          }}
        >
          {fieldError && fieldErrorHtml !== undefined && (
            <KcAlert
              severity="danger"
              fallbackTitle={msg("alertErrorTitle")}
              html={fieldErrorHtml}
            />
          )}
          {!usernameHidden && (
            <TextField
              tabIndex={2}
              id="username"
              name="username"
              label={usernameLabel}
              defaultValue={login.username ?? ""}
              autoFocus
              autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
              error={fieldError}
              fullWidth
              aria-invalid={fieldError || undefined}
            />
          )}

          <PasswordField
            tabIndex={3}
            id="password"
            name="password"
            label={msg("password")}
            autoComplete="current-password"
            error={fieldError}
            revealLabel={msgStr("showPassword")}
            hideLabel={msgStr("hidePassword")}
            aria-invalid={fieldError || undefined}
          />

          <div className="iam-form__row">
            {realm.rememberMe && !usernameHidden ? (
              <Checkbox
                tabIndex={5}
                id="rememberMe"
                name="rememberMe"
                defaultChecked={!!login.rememberMe}
                label={msg("rememberMe")}
              />
            ) : (
              <span />
            )}
            {realm.resetPasswordAllowed && (
              <a className="iam-link" tabIndex={6} href={url.loginResetCredentialsUrl}>
                {msg("doForgotPassword")}
              </a>
            )}
          </div>

          <input
            type="hidden"
            id="id-hidden-input"
            name="credentialId"
            value={auth.selectedCredential}
          />
          <Button
            tabIndex={7}
            type="submit"
            name="login"
            id="kc-login"
            className="iam-submit"
            fullWidth
            loading={isLoginButtonDisabled}
            disabled={isLoginButtonDisabled}
          >
            {msg("doLogIn")}
          </Button>
        </form>
      )}

      {enableWebAuthnConditionalUI && (
        <>
          <form id="webauth" action={url.loginAction} method="post">
            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
            <input type="hidden" id="authenticatorData" name="authenticatorData" />
            <input type="hidden" id="signature" name="signature" />
            <input type="hidden" id="credentialId" name="credentialId" />
            <input type="hidden" id="userHandle" name="userHandle" />
            <input type="hidden" id="error" name="error" />
          </form>
          {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
            <form id="authn_select" hidden>
              {authenticators.authenticators.map((authenticator) => (
                <input
                  key={authenticator.credentialId}
                  type="hidden"
                  name="authn_use_chk"
                  readOnly
                  value={authenticator.credentialId}
                />
              ))}
            </form>
          )}
          <Button id={webAuthnButtonId} type="button" variant="secondary" fullWidth>
            {msg("passkey-doAuthenticate")}
          </Button>
        </>
      )}
    </Template>
  );
}
