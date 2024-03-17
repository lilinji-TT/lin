import cs from "classnames";
import "index.scss";
import { CSSProperties, PropsWithChildren, forwardRef } from "react";
interface BaseIconProps {
  className?: string | string[];
  style?: CSSProperties;
  size?: string | string[];
  spin?: boolean;
}

export type IconProps = BaseIconProps &
  Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps["size"]) => {
  if (Array.isArray(size) && size.length === 2) {
    return size as string[];
  }

  // 参数归一
  const width = (size as string) || "1em";
  const height = (size as string) || "1em";

  return [width, height];
};
export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(
  (props, ref) => {
    const { style, size = "1em", className, spin, children, ...rest } = props;

    const [width, height] = getSize(size);

    const cn = cs(
      "icon",
      {
        "icon-spin": spin,
      },
      className
    );

    return (
      <svg
        ref={ref}
        style={style}
        width={width}
        height={height}
        fill="currentColor"
        className={cn}
        {...rest}
      >
        {children}
      </svg>
    );
  }
);
