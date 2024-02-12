import cs from "classnames";
import { CSSProperties, useState } from "react";
import { Color } from "./color";
import { ColorType } from "./interface";
import Palette from "./Palette";

export interface ColorPickerProps {
  style?: CSSProperties;
  className?: string;
  value?: ColorType;
  onChange?: (value: Color) => void;
}
export default function ColorPickerPanel(props: ColorPickerProps) {
  const { style, className, value, onChange } = props;
  const [colorValue, setColorValue] = useState<Color>(() => {
    if (value instanceof Color) {
      return value;
    }

    return new Color(value);
  });
  const classNames = cs("color-picker", className);

  return (
    <div className={classNames} style={style}>
      <Palette color={colorValue}></Palette>
    </div>
  );
}
