import type { Color } from "./color";

type ColorCount = number | string;
export interface HSL {
  h: ColorCount;
  s: ColorCount;
  l: ColorCount;
}

export interface RGB {
  r: ColorCount;
  g: ColorCount;
  b: ColorCount;
}

export interface HSLA extends HSL {
  a: number;
}

export interface RGBA extends RGB {
  a: number;
}

export type ColorType = ColorCount | RGB | RGBA | HSL | HSLA | Color;
