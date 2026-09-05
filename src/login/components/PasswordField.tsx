import type { InputHTMLAttributes, ReactNode } from "react";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { iconEye, iconEyeOff } from "@okkly/icons";
import { Icon, IconButton, TextField } from "@okkly/react";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "color"> & {
  id: string;
  label: ReactNode;
  error?: boolean;
  helperText?: ReactNode;
  revealLabel: string;
  hideLabel: string;
};

export function PasswordField({
  id,
  label,
  error,
  helperText,
  revealLabel,
  hideLabel,
  ...rest
}: PasswordFieldProps) {
  const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
    passwordInputId: id,
  });

  return (
    <TextField
      id={id}
      label={label}
      type={isPasswordRevealed ? "text" : "password"}
      error={error}
      helperText={helperText}
      fullWidth
      endAdornment={
        <IconButton
          type="button"
          size="small"
          className="iam-password-toggle"
          aria-label={isPasswordRevealed ? hideLabel : revealLabel}
          aria-controls={id}
          onClick={toggleIsPasswordRevealed}
        >
          <Icon icon={isPasswordRevealed ? iconEyeOff : iconEye} />
        </IconButton>
      }
      {...rest}
    />
  );
}
