import {
  FloatingArrow,
  arrow,
  flip,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./index.scss";

type Alignment = "start" | "end";
type Side = "top" | "bottom" | "left" | "right";
type AlignedPlacement = `${Side}-${Alignment}`;
interface PopoverProps extends PropsWithChildren {
  content: ReactNode;
  trigger?: "hover" | "click";
  placement?: Side | AlignedPlacement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
}
// based on floating-ui/react, link: https://floating-ui.com/
export default function Popover(props: PopoverProps) {
  const {
    open,
    onOpenChange,
    content,
    children,
    trigger = "hover",
    className,
    style,
    placement = "bottom",
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  // useFloating hook 计算浮层位置
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    placement,
    middleware: [offset(10), arrow({ element: arrowRef }), flip()],
  });

  const hover = useHover(context, {
    enabled: trigger === "hover",
  });
  const click = useClick(context, {
    enabled: trigger === "click",
  });
  const dismiss = useDismiss(context);
  // useInteractions 是用来绑定交互事件的
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
  ]);

  const el = useMemo(() => {
    const el = document.createElement("div");
    el.className = "wrapper";
    document.body.appendChild(el);

    return el;
  }, []);

  const floating = isOpen && (
    <div
      className="popover-floating"
      ref={refs.setFloating}
      style={floatingStyles}
      {...getFloatingProps()}
    >
      {content}
      <FloatingArrow
        ref={arrowRef}
        context={context}
        fill="#fff"
        stroke="#000"
        strokeWidth={1}
      />
    </div>
  );

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className={className}
        style={style}
      >
        {children}
      </span>
      {createPortal(floating, el)}
    </>
  );
}
