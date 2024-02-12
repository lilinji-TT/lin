import { useRef } from "react";
import Handler from "./Handler";
import Transform from "./Transform";
import { Color } from "./color";
export default function Palette(props: { color: Color }) {
  const { color } = props;
  const transformRef = useRef<HTMLDivElement>(null);
  return (
    <div className="color-picker-panel-palette">
      <Transform ref={transformRef} offset={{ x: 50, y: 50 }}>
        <Handler color={color.toRgbString()}></Handler>
      </Transform>
      <div
        className="color-picker-panel-palette-main"
        style={{
          backgroundColor: `hsl(${color.toHsl().h},100%, 50%)`,
          backgroundImage:
            "linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))",
        }}
      ></div>
    </div>
  );
}
