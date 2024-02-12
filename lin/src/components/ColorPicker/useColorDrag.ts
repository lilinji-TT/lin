import { useEffect, useRef, useState } from "react";
import { TransformOffset } from "./Transform";

type EventType = MouseEvent | React.MouseEvent<Element, MouseEvent>;

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
  offset?: TransformOffset;
  containerRef: React.RefObject<HTMLDivElement>;
  targetRef: React.RefObject<HTMLDivElement>;
  direction?: "x" | "y";
  onDragChange?: (offset: TransformOffset) => void;
}

function useColorDrag(
  props: useColorDragProps
): [TransformOffset, EventHandle] {
  const { offset, targetRef, containerRef, direction, onDragChange } = props;

  const [offsetValue, setOffsetValue] = useState(offset || { x: 0, y: 0 });
  const dragRef = useRef({
    flag: false,
  });

  useEffect(() => {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragStop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOffset: EventHandle = (e) => {
    const scrollXOffset =
      document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollYOffset =
      document.documentElement.scrollTop || document.body.scrollTop;

    // e.pageX和e.pageY是距离文档顶部和水平的距离，文档左上角可以被移出可视窗口，所以需要减去滚动的偏移量
    // 以下计算得出的是鼠标指针在可视窗口的位置
    const pageX = e.pageX - scrollXOffset;
    const pageY = e.pageY - scrollYOffset;

    const {
      x: rectX,
      y: rectY,
      width,
      height,
    } = containerRef.current!.getBoundingClientRect();

    const { width: targetWidth, height: targetHeight } =
      targetRef.current!.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;

    const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
    const offsetY =
      Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

    const calcOffset = {
      x: offsetX,
      y: direction === "x" ? offsetValue.y : offsetY,
    };

    setOffsetValue(calcOffset);
    onDragChange?.(calcOffset);
  };

  const onDragStop: EventHandle = (e) => {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragStop);

    dragRef.current.flag = false;
  };

  const onDragMove: EventHandle = (e) => {
    e.preventDefault();
    updateOffset(e);
  };

  const onDragStart: EventHandle = (e) => {
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragStop);

    dragRef.current.flag = true;
  };

  return [offsetValue, onDragStart];
}

export default useColorDrag;
