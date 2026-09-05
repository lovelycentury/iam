import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, Typography } from "@okkly/react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { message, client, skipLink } = kcContext;
  const { msg } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("errorTitle")}
    >
      <div className="iam-error">
        <Typography variant="body-md">
          <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
        </Typography>
        {!skipLink && !!client?.baseUrl && (
          <Button href={client.baseUrl} variant="secondary" fullWidth>
            {msg("backToApplication")}
          </Button>
        )}
      </div>
    </Template>
  );
}
