import classNames from "classnames";
import React, { CSSProperties, useRef, useState } from "react";
import FormContext from "./FormContext";
export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
  sytle?: CSSProperties;
  /** 提交的回调 */
  onFinish?: (values: Record<string, any>) => void;
  /** 提交失败的回调 */
  onFinishFalied?: (errors: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  children?: React.ReactNode;
}

export function From(props: FormProps) {
  const {
    className,
    sytle,
    onFinish,
    onFinishFalied,
    initialValues,
    children,
    ...others
  } = props;

  const [values, setValues] = useState<Record<string, any>>(
    initialValues || {}
  );
  const validaeMap = useRef(new Map<string, Function>());
  const errors = useRef<Record<string, any>>({});
  const onValueChange = (key: string, value: any) => {
    values[key] = value;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (let [key, callback] of validaeMap.current) {
      if (typeof callback === "function") {
        errors.current[key] = callback(values[key]);
      }
    }

    const errorList = Object.values(errors.current).filter(Boolean);
    if (errorList.length) {
      onFinishFalied?.(errors.current);
    } else {
      onFinish?.(values);
    }
  };

  const handleValidateRegister = (key: string, callback: Function) => {
    validaeMap.current.set(key, callback);
  };

  const newClassNames = classNames("lin-form", className);

  return (
    <FormContext.Provider
      value={{
        values,
        onValueChange,
        setValues: (v) => setValues(v),
        validateRegister: handleValidateRegister,
      }}
    >
      <form
        {...others}
        className={newClassNames}
        style={sytle}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
