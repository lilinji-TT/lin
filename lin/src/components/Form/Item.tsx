/* eslint-disable react-hooks/rules-of-hooks */
import Schema from "async-validator";
import classNames from "classnames";
import React, {
  CSSProperties,
  ChangeEvent,
  ReactElement,
  cloneElement,
  useContext,
  useEffect,
  useState,
} from "react";
import FormContext from "./FormContext";

export interface ItemProps {
  className?: string;
  style?: CSSProperties;
  label?: string;
  name?: string;
  valuePropName?: string;
  rules?: Array<Record<string, any>>;
  children?: ReactElement;
}

const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
  const { target } = e;
  if (target.type === "checkbox") {
    return target.checked;
  } else if (target.type === "radio") {
    return target.value;
  }

  return target.value;
};
export function Item(props: ItemProps) {
  const { children, name, label, style, className, valuePropName, rules } =
    props;

  if (!name) {
    return children;
  }
  const [value, setValue] = useState<string | number | boolean>();
  const [error, setError] = useState<string>("");
  const { onValueChange, validateRegister, values } = useContext(FormContext);

  useEffect(() => {
    if (value !== values?.[name]) {
      setValue(values?.[name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, values?.[name]]);

  const handleValidate = (value: any) => {
    let errMsg = null;
    if (Array.isArray(rules) && rules.length) {
      const validator = new Schema({
        [name]: rules.map((rule) => {
          return {
            type: "string",
            ...rule,
          };
        }),
      });

      validator.validate({ [name]: value }, (errors) => {
        if (errors) {
          if (errors?.length) {
            setError(errors[0].message!);
            errMsg = errors[0].message;
          }
        } else {
          setError("");
          errMsg = null;
        }
      });
    }

    return errMsg;
  };

  useEffect(() => {
    validateRegister?.(name, () => handleValidate(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const propsName: Record<string, any> = {};

  if (valuePropName) {
    propsName[valuePropName] = value;
  } else {
    propsName.value = value;
  }

  const childEle =
    React.Children.toArray(children).length > 1
      ? children
      : cloneElement(children!, {
          ...propsName,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            const value = getValueFromEvent(e);
            setValue(value);
            onValueChange?.(name, value);

            handleValidate(value);
          },
        });

  const newClassNames = classNames("lin-form-item", className);

  return (
    <div className={newClassNames} style={style}>
      <div>{label && <label>{label}</label>}</div>
      <div>
        {childEle}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}
