import { ReactNode, forwardRef } from "react";

export interface TransformOffset {
  x: number;
  y: number;
}

interface TransformProps {
  offset?: TransformOffset;
  children?: ReactNode;
}

const Transform = forwardRef<HTMLDivElement, TransformProps>((props, ref) => {
  const { offset, children } = props;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: offset?.x ?? 0,
        top: offset?.y ?? 0,
        zIndex: 999,
      }}
    >
      {children}
    </div>
  );
});

export default Transform;
