import { useContext } from "react";
import { matchPath, useLocation, useOutlet } from "react-router-dom";
import { KeepAliveContext, KeepPathArray } from "./context";

const isKeepPath = (keepPaths: KeepPathArray, path: string) => {
  for (let i = 0; i < keepPaths.length; i++) {
    let keepPath = keepPaths[i];
    if (keepPath === path) {
      return true;
    }
    if (keepPath instanceof RegExp && keepPath.test(path)) {
      return true;
    }
    if (typeof keepPath === "string" && keepPath.toLowerCase() === path) {
      return true;
    }
  }

  return false;
};
export function useKeepOutlet() {
  const location = useLocation();
  const element = useOutlet();

  const { keepElements, keepPaths } = useContext(KeepAliveContext);
  const isKeep = isKeepPath(keepPaths, location.pathname);

  if (isKeep) {
    keepElements![location.pathname] = element;
  }

  /**
   * 存在缓存对象中的组件渲染出来
   * 不存在则直接渲染组件元素
   */
  return (
    <>
      {Object.entries(keepElements).map(([pathname, element]) => {
        return (
          <div
            key={pathname}
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              overflow: "hidden auto",
            }}
            className="keep-alive-page"
            hidden={!matchPath(location.pathname, pathname)}
          >
            {element}
          </div>
        );
      })}
      {!isKeep && element}
    </>
  );
}
