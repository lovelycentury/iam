import { Fragment, useEffect, type Dispatch, type ReactNode } from "react";
import { assert } from "keycloakify/tools/assert";
import {
  getButtonToDisplayForMultivaluedAttributeField,
  useUserProfileForm,
  type FormAction,
  type FormFieldError,
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import { TextArea, TextField, Typography } from "@okkly/react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { PasswordField } from "./PasswordField";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
  const {
    kcContext,
    i18n,
    kcClsx,
    onIsFormSubmittableValueChange,
    doMakeUserConfirmPassword,
    BeforeField,
    AfterField,
  } = props;
  const { advancedMsg } = i18n;
  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction,
  } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword,
  });

  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable);
  }, [isFormSubmittable, onIsFormSubmittableValueChange]);

  const groupNameRef = { current: "" };

  return (
    <>
      {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
        const hidden =
          attribute.annotations.inputType === "hidden" ||
          (attribute.name === "password-confirm" && !doMakeUserConfirmPassword);

        if (hidden) {
          return (
            <Fragment key={attribute.name}>
              {attribute.annotations.inputType === "hidden" ? (
                <input type="hidden" name={attribute.name} value={singleValue(valueOrValues)} />
              ) : null}
            </Fragment>
          );
        }

        return (
          <Fragment key={attribute.name}>
            <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} />
            <div className="iam-register-fields__field" data-name={attribute.name}>
              {BeforeField !== undefined && (
                <BeforeField
                  attribute={attribute}
                  dispatchFormAction={dispatchFormAction}
                  displayableErrors={displayableErrors}
                  valueOrValues={valueOrValues}
                  kcClsx={kcClsx}
                  i18n={i18n}
                />
              )}
              {attribute.annotations.inputHelperTextBefore !== undefined && (
                <Typography variant="caption" color="muted">
                  {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                </Typography>
              )}
              <AttributeField
                attribute={attribute}
                valueOrValues={valueOrValues}
                displayableErrors={displayableErrors}
                dispatchFormAction={dispatchFormAction}
                i18n={i18n}
              />
              {attribute.annotations.inputHelperTextAfter !== undefined && (
                <Typography variant="caption" color="muted">
                  {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                </Typography>
              )}
              {AfterField !== undefined && (
                <AfterField
                  attribute={attribute}
                  dispatchFormAction={dispatchFormAction}
                  displayableErrors={displayableErrors}
                  valueOrValues={valueOrValues}
                  kcClsx={kcClsx}
                  i18n={i18n}
                />
              )}
            </div>
          </Fragment>
        );
      })}
    </>
  );
}

function GroupLabel(props: {
  attribute: Attribute;
  groupNameRef: { current: string };
  i18n: I18n;
}) {
  const { attribute, groupNameRef, i18n } = props;
  const { advancedMsg } = i18n;

  if (attribute.group?.name === groupNameRef.current) {
    return null;
  }

  groupNameRef.current = attribute.group?.name ?? "";
  if (groupNameRef.current === "") {
    return null;
  }

  assert(attribute.group !== undefined);
  const header = attribute.group.displayHeader
    ? advancedMsg(attribute.group.displayHeader)
    : attribute.group.name;
  const description = attribute.group.displayDescription
    ? advancedMsg(attribute.group.displayDescription)
    : undefined;

  return (
    <div className="iam-register-fields__group">
      <Typography variant="label-md" color="primary">
        {header}
      </Typography>
      {description !== undefined && (
        <Typography variant="caption" color="muted">
          {description}
        </Typography>
      )}
    </div>
  );
}

type AttributeFieldProps = {
  attribute: Attribute;
  valueOrValues: string | string[];
  displayableErrors: FormFieldError[];
  dispatchFormAction: Dispatch<FormAction>;
  i18n: I18n;
};

function AttributeField(props: AttributeFieldProps) {
  const { attribute, valueOrValues, displayableErrors, dispatchFormAction, i18n } = props;
  const inputType = attribute.annotations.inputType;

  if (Array.isArray(valueOrValues)) {
    return (
      <>
        {valueOrValues.map((value, fieldIndex) => (
          <Fragment key={fieldIndex}>
            <TextAttributeField
              {...props}
              value={value}
              fieldIndex={fieldIndex}
              displayableErrors={displayableErrors.filter(
                (error) => error.fieldIndex === fieldIndex,
              )}
            />
            <MultivalueButtons
              attribute={attribute}
              values={valueOrValues}
              fieldIndex={fieldIndex}
              dispatchFormAction={dispatchFormAction}
              i18n={i18n}
            />
          </Fragment>
        ))}
      </>
    );
  }

  switch (inputType) {
    case "textarea":
      return <TextAreaAttributeField {...props} value={valueOrValues} />;
    case "select":
    case "multiselect":
    case "select-radiobuttons":
    case "multiselect-checkboxes":
      return <NativeChoiceField {...props} />;
    default:
      return <TextAttributeField {...props} value={valueOrValues} fieldIndex={undefined} />;
  }
}

function TextAttributeField(
  props: AttributeFieldProps & { value: string; fieldIndex: number | undefined },
) {
  const { attribute, value, fieldIndex, displayableErrors, dispatchFormAction, i18n } = props;
  const { advancedMsg, advancedMsgStr, msgStr } = i18n;
  const { error, helperText } = fieldErrorProps(displayableErrors);
  const label = advancedMsg(attribute.displayName ?? attribute.name);
  const isPassword = attribute.name === "password" || attribute.name === "password-confirm";
  const shared = {
    id: fieldIndex === undefined ? attribute.name : `${attribute.name}-${fieldIndex}`,
    name: attribute.name,
    label,
    value,
    required: attribute.required,
    disabled: attribute.readOnly,
    autoComplete: attribute.autocomplete,
    error,
    helperText,
    placeholder:
      attribute.annotations.inputTypePlaceholder === undefined
        ? undefined
        : advancedMsgStr(attribute.annotations.inputTypePlaceholder),
    onChange: (event: { target: { value: string } }) =>
      dispatchFormAction({
        action: "update",
        name: attribute.name,
        valueOrValues:
          fieldIndex === undefined
            ? event.target.value
            : replaceAt(assertStringArray(props.valueOrValues), fieldIndex, event.target.value),
      }),
    onBlur: () =>
      dispatchFormAction({
        action: "focus lost",
        name: attribute.name,
        fieldIndex,
      }),
  };

  if (isPassword) {
    return (
      <PasswordField
        {...shared}
        revealLabel={msgStr("showPassword")}
        hideLabel={msgStr("hidePassword")}
      />
    );
  }

  return (
    <TextField
      {...shared}
      type={htmlInputType(attribute)}
      pattern={attribute.annotations.inputTypePattern}
      maxLength={annotationNumber(attribute.annotations.inputTypeMaxlength)}
      minLength={annotationNumber(attribute.annotations.inputTypeMinlength)}
      max={attribute.annotations.inputTypeMax}
      min={attribute.annotations.inputTypeMin}
      step={attribute.annotations.inputTypeStep}
      fullWidth
    />
  );
}

function TextAreaAttributeField(props: AttributeFieldProps & { value: string }) {
  const { attribute, value, displayableErrors, dispatchFormAction, i18n } = props;
  const { advancedMsg } = i18n;
  const { error, helperText } = fieldErrorProps(displayableErrors);

  return (
    <TextArea
      id={attribute.name}
      name={attribute.name}
      label={advancedMsg(attribute.displayName ?? attribute.name)}
      value={value}
      disabled={attribute.readOnly}
      error={error}
      helperText={helperText}
      fullWidth
      rows={annotationNumber(attribute.annotations.inputTypeRows) ?? 3}
      maxLength={annotationNumber(attribute.annotations.inputTypeMaxlength)}
      onChange={(event) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: event.target.value,
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined,
        })
      }
    />
  );
}

function NativeChoiceField(props: AttributeFieldProps) {
  const { attribute, valueOrValues, displayableErrors, dispatchFormAction, i18n } = props;
  const { advancedMsg } = i18n;
  const { error, helperText } = fieldErrorProps(displayableErrors);
  const options = attributeOptions(attribute);
  const inputType = attribute.annotations.inputType;
  const isMultiple = inputType === "multiselect" || inputType === "multiselect-checkboxes";
  const isSelect = inputType === "select" || inputType === "multiselect";

  return (
    <div className="iam-native-fields">
      <label htmlFor={attribute.name}>
        {advancedMsg(attribute.displayName ?? attribute.name)}
        {attribute.required ? " *" : null}
      </label>
      {isSelect ? (
        <select
          id={attribute.name}
          name={attribute.name}
          disabled={attribute.readOnly}
          multiple={isMultiple}
          value={valueOrValues}
          aria-invalid={error || undefined}
          onChange={(event) =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: isMultiple
                ? Array.from(event.target.selectedOptions, (option) => option.value)
                : event.target.value,
            })
          }
          onBlur={() =>
            dispatchFormAction({
              action: "focus lost",
              name: attribute.name,
              fieldIndex: undefined,
            })
          }
        >
          {!isMultiple && <option value="" />}
          {options.map((option) => (
            <option key={option} value={option}>
              {optionLabel(i18n, attribute, option)}
            </option>
          ))}
        </select>
      ) : (
        options.map((option) => (
          <label key={option} className="iam-native-fields__choice">
            <input
              type={isMultiple ? "checkbox" : "radio"}
              name={attribute.name}
              value={option}
              disabled={attribute.readOnly}
              checked={
                Array.isArray(valueOrValues)
                  ? valueOrValues.includes(option)
                  : valueOrValues === option
              }
              onChange={(event) => {
                const checked = event.target.checked;
                dispatchFormAction({
                  action: "update",
                  name: attribute.name,
                  valueOrValues: Array.isArray(valueOrValues)
                    ? checked
                      ? [...valueOrValues, option]
                      : valueOrValues.filter((value) => value !== option)
                    : checked
                      ? option
                      : "",
                });
              }}
              onBlur={() =>
                dispatchFormAction({
                  action: "focus lost",
                  name: attribute.name,
                  fieldIndex: undefined,
                })
              }
            />
            {optionLabel(i18n, attribute, option)}
          </label>
        ))
      )}
      {helperText !== undefined && (
        <Typography variant="caption" color="danger">
          {helperText}
        </Typography>
      )}
    </div>
  );
}

function MultivalueButtons(props: {
  attribute: Attribute;
  values: string[];
  fieldIndex: number;
  dispatchFormAction: Dispatch<FormAction>;
  i18n: I18n;
}) {
  const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;
  const { msg } = i18n;
  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
    attribute,
    values,
    fieldIndex,
  });

  if (!hasAdd && !hasRemove) {
    return null;
  }

  return (
    <div className="iam-register-fields__add-remove">
      {hasRemove && (
        <button
          type="button"
          className="iam-link"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: values.filter((_, index) => index !== fieldIndex),
            })
          }
        >
          {msg("remove")}
        </button>
      )}
      {hasAdd && (
        <button
          type="button"
          className="iam-link"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: [...values, ""],
            })
          }
        >
          {msg("addValue")}
        </button>
      )}
    </div>
  );
}

function fieldErrorProps(errors: FormFieldError[]) {
  if (errors.length === 0) {
    return { error: false, helperText: undefined };
  }

  return {
    error: true,
    helperText: errors.map((item, index) => (
      <span key={index}>
        {index > 0 ? " " : null}
        {item.errorMessage}
      </span>
    )) as ReactNode,
  };
}

function htmlInputType(attribute: Attribute) {
  const { inputType } = attribute.annotations;
  if (inputType?.startsWith("html5-")) {
    return inputType.slice("html5-".length);
  }
  if (attribute.name === "email") {
    return "email";
  }
  return "text";
}

function annotationNumber(value: string | number | undefined) {
  if (value === undefined) {
    return undefined;
  }
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function singleValue(valueOrValues: string | string[]) {
  return typeof valueOrValues === "string" ? valueOrValues : (valueOrValues[0] ?? "");
}

function assertStringArray(valueOrValues: string | string[]): string[] {
  assert(Array.isArray(valueOrValues));
  return valueOrValues;
}

function replaceAt(values: string[], index: number, value: string) {
  return values.map((current, currentIndex) => (currentIndex === index ? value : current));
}

function attributeOptions(attribute: Attribute) {
  const fromValidation = attribute.annotations.inputOptionsFromValidation;
  if (fromValidation !== undefined) {
    const validator = (attribute.validators as Record<string, { options?: string[] }>)[
      fromValidation
    ];
    if (validator?.options !== undefined) {
      return validator.options;
    }
  }
  return attribute.validators.options?.options ?? [];
}

function optionLabel(i18n: I18n, attribute: Attribute, option: string) {
  const { advancedMsg } = i18n;
  if (attribute.annotations.inputOptionLabels !== undefined) {
    return advancedMsg(attribute.annotations.inputOptionLabels[option] ?? option);
  }
  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
  }
  return option;
}
