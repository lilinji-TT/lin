import type { FC } from "react";
import { PropsWithChildren, ReactNode, createContext, useContext } from "react";
export type KeepPathArray = Array<string | RegExp>;
interface KeepAliveLayoutProps extends PropsWithChildren {
  keepPaths: KeepPathArray;
  keepElements?: Record<string, ReactNode>;
  dropByPath?: (path: string) => void;
}

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, "children">;

// 存储缓存组件元素
const keepElements: KeepAliveContextType["keepElements"] = {};

export const KeepAliveContext = createContext<KeepAliveContextType>({
  keepPaths: [],
  keepElements,
  dropByPath: (path: string) => {
    keepElements[path] = null;
  },
});



const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
  const { keepPaths, ...other } = props;
  const { keepElements, dropByPath } = useContext(KeepAliveContext);

  return (
    <KeepAliveContext.Provider
      value={{ keepPaths, keepElements, dropByPath }}
      {...other}
    ></KeepAliveContext.Provider>
  );
};

export default KeepAliveLayout;
