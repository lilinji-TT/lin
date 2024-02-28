import React, { PropsWithChildren } from "react";
import { SizeType } from "./index";

export interface ConfigContextType {
  space?: {
    size?: SizeType;
  };
}

export const ConfigContext = React.createContext<ConfigContextType>(
  {} as ConfigContextType
);

interface ConfigContextProps extends PropsWithChildren<ConfigContextType> {}

export function ConfigProvider(props: ConfigContextProps) {
  const { space, children } = props;

  return (
    <ConfigContext.Provider value={{ space }}>
      {children}
    </ConfigContext.Provider>
  );
}
