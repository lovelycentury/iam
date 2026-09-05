import { useEffect, type ReactNode } from "react";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { Button, Typography, type AlertSeverity } from "@okkly/react";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { KcAlert } from "./components/KcAlert";
import { LocaleFab } from "./components/LocaleFab";
import { ThemeFab } from "./components/ThemeFab";

const MESSAGE_SEVERITY: Record<string, AlertSeverity> = {
  success: "success",
  warning: "warning",
  error: "danger",
  info: "info",
};

const MESSAGE_TITLE_KEY = {
  success: "alertSuccessTitle",
  warning: "alertWarningTitle",
  error: "alertErrorTitle",
  info: "alertInfoTitle",
} as const;

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    children,
  } = props;

  const { msg, msgStr } = i18n;
  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
  }, [documentTitle, msgStr, realm.displayName, realm.name]);

  useSetClassName({
    qualifiedName: "html",
    className: "iam-html",
  });

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? "iam-body",
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  const showUsername = auth !== undefined && auth.showUsername && !auth.showResetCredentials;
  const showMessage =
    displayMessage &&
    message !== undefined &&
    (message.type !== "warning" || !isAppInitiatedAction);

  return (
    <div className="iam-shell">
      <aside className="iam-brand">
        <span className="iam-brand__glow iam-brand__glow--a" />
        <span className="iam-brand__glow iam-brand__glow--b" />
        <div className="iam-brand__copy">
          <div className="iam-brand__mark" aria-hidden="true">
            OK
          </div>
          <Typography className="iam-brand__headline" variant="display-lg" as="p" color="primary">
            {msg("brandHeadline")}
          </Typography>
          <Typography className="iam-brand__tagline" variant="body-md" color="secondary">
            {msg("brandTagline")}
          </Typography>
        </div>
      </aside>

      <main className="iam-main">
        <div className="iam-panel">
          <header className="iam-panel__header">
            {showUsername ? (
              <div className="iam-attempted-user">
                <Typography variant="body-md" color="primary">
                  {auth.attemptedUsername}
                </Typography>
                <Button href={url.loginRestartFlowUrl} variant="ghost" size="small">
                  {msg("restartLoginTooltip")}
                </Button>
              </div>
            ) : (
              <Typography variant="h3" as="h1" id="kc-page-title" color="primary">
                {headerNode}
              </Typography>
            )}
            {displayRequiredFields && (
              <Typography variant="caption" color="muted">
                * {msg("requiredFields")}
              </Typography>
            )}
          </header>

          {showMessage && message !== undefined && (
            <KcAlert
              severity={MESSAGE_SEVERITY[message.type] ?? "info"}
              fallbackTitle={msg(
                MESSAGE_TITLE_KEY[message.type as keyof typeof MESSAGE_TITLE_KEY] ??
                  "alertInfoTitle",
              )}
              html={message.summary}
            />
          )}

          {children}

          {auth !== undefined && auth.showTryAnotherWayLink && (
            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
              <input type="hidden" name="tryAnotherWay" value="on" />
              <Button type="submit" variant="ghost" fullWidth className="iam-try-another-way">
                {msg("doTryAnotherWay")}
              </Button>
            </form>
          )}

          {socialProvidersNode}

          {displayInfo && infoNode !== undefined && infoNode !== null && (
            <div className="iam-info">{infoNode as ReactNode}</div>
          )}
        </div>
      </main>

      <div className="iam-fabs">
        <ThemeFab i18n={i18n} />
        <LocaleFab i18n={i18n} />
      </div>
    </div>
  );
}
