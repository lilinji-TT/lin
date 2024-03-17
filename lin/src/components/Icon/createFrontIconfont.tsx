import React from "react";
import { Icon, IconProps } from ".";

const loadedSet = new Set<string>();

export function createFromIconfont(scriptUrl: string) {
  // 判断引入的Iconfont URL是否重复、是否存在
  if (
    typeof scriptUrl === "string" &&
    scriptUrl.length &&
    !loadedSet.has(scriptUrl)
  ) {
    const script = document.createElement("script");
    script.setAttribute("src", scriptUrl);
    script.setAttribute("data-name", scriptUrl);
    document.body.appendChild(script);
    loadedSet.add(scriptUrl);
  }

  const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;

    return (
      <Icon {...rest} ref={ref}>
        {type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  });

  return Iconfont;
}
