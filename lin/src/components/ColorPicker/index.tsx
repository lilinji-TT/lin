import cs from "classnames";
import { CSSProperties, useState } from "react";
import Palette from "./Palette";
import { Color } from "./color";
import { ColorType } from "./interface";
import './index.scss'

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

  function onPaleteColorChange(color: Color) {
    setColorValue(color);
    onChange?.(color);
  }
  return (
    <div className={classNames} style={style}>
      <Palette color={colorValue} onChange={onPaleteColorChange}></Palette>
      <div
        style={{ width: 20, height: 20, background: colorValue.toRgbString() }}
      ></div>
    </div>
  );
}
