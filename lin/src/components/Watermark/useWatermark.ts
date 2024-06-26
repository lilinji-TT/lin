import { merge } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { WatermarkProps } from ".";

export type WatermarkOptions = Omit<
  WatermarkProps,
  "className" | "style" | "children"
>;

export function isNumber(value: any): value is number {
  return (
    Object.prototype.toString.call(value) === "[object Number]" &&
    // eslint-disable-next-line no-self-compare
    value === value
  );
}

const toNumber = (value?: string | number, defaultValue?: number) => {
  if (!value) {
    return defaultValue;
  }

  if (isNumber(value)) {
    return value;
  }

  const newNumber = parseFloat(value);

  return isNumber(newNumber) ? newNumber : defaultValue;
};

const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.15)",
    fontFamily: "sans-serif",
    fontWeight: "normal",
  },
  getContainer: () => document.body,
};

const getMergedOptions = (opt: Partial<WatermarkOptions>) => {
  const options = opt || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(
      options.width,
      options.image ? defaultOptions.width : undefined
    ),
    height: toNumber(options.height, undefined)!,
    getContainer: options.getContainer!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>;

  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(
    mergedOptions.offset?.[1] || mergedOptions.offset?.[0],
    0
  )!;

  mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

  return mergedOptions;
};

const getCanvasData = async (
  options: Required<WatermarkOptions>
): Promise<{
  width: number;
  height: number;
  base64Url: string;
}> => {
  const { rotate, image, content, fontStyle, gap } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const ratio = window.devicePixelRatio;

  const configCanvas = (size: { width: number; height: number }) => {
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;

    canvas.setAttribute("width", `${canvasWidth * ratio}px`);
    canvas.setAttribute("height", `${canvasHeight * ratio}px`);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    ctx.scale(ratio, ratio);

    const RotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(RotateAngle);
  };

  const measureTextSize = (
    ctx: CanvasRenderingContext2D,
    content: string[],
    rotate: number
  ) => {
    let width = 0;
    let height = 0;
    const lineSize: Array<{ width: number; height: number }> = [];

    content.forEach((item) => {
      const {
        width: textWidth,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
      } = ctx.measureText(item);

      const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

      if (textWidth > width) {
        width = textWidth;
      }

      height += textHeight;
      lineSize.push({ height: textHeight, width: textWidth });
    });

    const angle = (rotate * Math.PI) / 180;

    return {
      originWidth: width,
      originHeight: height,
      width: Math.ceil(
        Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)
      ),
      height: Math.ceil(
        Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))
      ),
      lineSize,
    };
  };

  const drawText = () => {
    const { fontSize, color, fontFamily, fontWeight } = fontStyle;
    const realFontSize = toNumber(fontSize, 0) || fontSize;
    const font = `${fontWeight} ${realFontSize}px ${fontFamily}`;

    ctx.font = font;
    const measureSize = measureTextSize(ctx, [...content], rotate);

    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    configCanvas({ width, height });

    ctx.fillStyle = color!;
    ctx.font = font;
    ctx.textBaseline = "top";

    [...content].forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } =
        measureSize.lineSize[index];

      const xStartPoint = -lineWidth / 2;
      const yStartPoint =
        -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      ctx.fillText(
        item,
        xStartPoint,
        yStartPoint,
        options.width || measureSize.originWidth
      );
    });

    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  function drawImage() {
    return new Promise<{ width: number; height: number; base64Url: string }>(
      (resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";

        img.src = image;
        img.onload = () => {
          let { width, height } = options;
          if (!width || !height) {
            if (width) {
              height = (img.height / img.width) * +width;
            } else {
              width = (img.width / img.height) * +height;
            }
          }

          configCanvas({ width, height });

          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          return resolve({ width, height, base64Url: canvas.toDataURL() });
        };

        img.onerror = () => {
          return drawText();
        };
      }
    );
  }

  return image ? drawImage() : drawText();
};

export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);
  const watermarkDiv = useRef<HTMLDivElement>();
  const mutationObserver = useRef<MutationObserver>();

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  function drawWatermark() {
    if (!container) return;

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
      const offsetLeft = mergedOptions.offset[0] + "px";
      const offsetTop = mergedOptions.offset[1] + "px";

      const wmStyle = `
        width:calc(100% - ${offsetLeft});
        height:calc(100% - ${offsetTop});
        position:absolute;
        top:${offsetTop};
        left:${offsetLeft};
        bottom:0;
        right:0;
        pointer-events: none;
        z-index:${zIndex};
        background-position: 0 0;
        background-size:${gap[0] + width}px ${gap[1] + height}px;
        background-repeat: repeat;
        background-image:url(${base64Url})
     `;

      if (!watermarkDiv.current) {
        const div = document.createElement("div");
        watermarkDiv.current = div;
        container.appendChild(div);
        container.style.position = "relative";
      }

      watermarkDiv.current?.setAttribute("style", wmStyle.trim());

      if (container) {
        mutationObserver.current?.disconnect();

        mutationObserver.current = new MutationObserver((mutations) => {
          const isChanged = mutations.some((mutation) => {
            let flag = false;
            if (mutation.removedNodes.length) {
              flag = Array.from(mutation.removedNodes).some(
                (node) => node === watermarkDiv.current
              );
            }

            if (
              mutation.type === "attributes" &&
              mutation.target === watermarkDiv.current
            ) {
              flag = true;
            }
            return flag;
          });

          if (isChanged) {
            watermarkDiv.current = undefined;
            drawWatermark();
          }

          mutationObserver.current?.observe(container, {
            attributes: true,
            subtree: true,
            childList: true,
          });
        });
      }
    });
  }

  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {},
  };
}
