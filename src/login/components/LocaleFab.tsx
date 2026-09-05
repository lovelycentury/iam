import { useEffect, useId, useRef, useState } from "react";
import { iconLanguages, iconX } from "@okkly/icons";
import { Fab, Icon, type FabColor } from "@okkly/react";
import type { I18n } from "../i18n";

const OPTION_COLORS = [
  "primary",
  "indigo",
  "violet",
  "dante",
  "ice",
  "ember",
] as const satisfies readonly FabColor[];

type LocaleFabProps = {
  i18n: I18n;
};

function localeCode(languageTag: string) {
  return languageTag.split("-")[0]?.toUpperCase() ?? languageTag;
}

export function LocaleFab({ i18n }: LocaleFabProps) {
  const { msgStr, currentLanguage, enabledLanguages } = i18n;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (enabledLanguages.length < 2) {
    return null;
  }

  return (
    <div className="iam-locale" ref={rootRef}>
      <div className="iam-locale__dial" data-open={open ? "" : undefined} id={menuId} role="menu">
        {enabledLanguages.map(({ languageTag, label, href }, index) => {
          const active = languageTag === currentLanguage.languageTag;
          return (
            <Fab
              key={languageTag}
              size="small"
              variant={active ? "standard" : "soft"}
              color={OPTION_COLORS[index % OPTION_COLORS.length]}
              href={href}
              icon={<span className="iam-locale__code">{localeCode(languageTag)}</span>}
              aria-label={label}
              aria-current={active ? "true" : undefined}
              role="menuitem"
            />
          );
        })}
      </div>
      <Fab
        color="primary"
        icon={<Icon icon={open ? iconX : iconLanguages} />}
        aria-label={open ? msgStr("closeLanguages") : msgStr("openLanguages")}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      />
    </div>
  );
}
