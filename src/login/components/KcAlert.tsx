import type { ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Alert, type AlertSeverity } from "@okkly/react";

type KcAlertProps = {
  severity: AlertSeverity;
  fallbackTitle: ReactNode;
  html: string;
};

export function KcAlert({ severity, fallbackTitle, html }: KcAlertProps) {
  const sanitized = kcSanitize(html);
  const parts = sanitized
    .split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);
  const titleHtml = parts.length >= 2 ? parts[0] : undefined;
  const bodyHtml = parts.length >= 2 ? parts.slice(1).join("<br />") : sanitized;

  return (
    <Alert
      className="iam-alert"
      severity={severity}
      title={titleHtml ? <span dangerouslySetInnerHTML={{ __html: titleHtml }} /> : fallbackTitle}
    >
      <span dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </Alert>
  );
}
