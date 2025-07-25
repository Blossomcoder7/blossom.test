import { motion, useMotionValue } from "framer-motion";
import { useRef, useEffect, type ReactNode } from "react";

export const DraggableRotation = ({
  children,
  sensitivity = 0.3,
  disabled = false,
  dragThreshold = 5, // Minimum pixels to move before starting drag
}: {
  children?: ReactNode;
  sensitivity?: number;
  disabled?: boolean;
  dragThreshold?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotate = useMotionValue(0);

  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastRotation = useRef(0);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el || disabled) {
      return;
    }

    const handlePointerDown = (e: PointerEvent) => {
      // Prevent dragging on interactive elements
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea, button, select, a, [contenteditable], [role="button"]')) {
        return;
      }

      pointerStart.current = { x: e.clientX, y: e.clientY };
      isDragging.current = false;
      hasMoved.current = false;
      el.setPointerCapture(e.pointerId);
      
      // Prevent default to avoid text selection during potential drag
      e.preventDefault();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (pointerStart.current === null) return;

      const deltaX = e.clientX - pointerStart.current.x;
      const deltaY = e.clientY - pointerStart.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Only start dragging after moving beyond threshold
      if (!isDragging.current && distance > dragThreshold) {
        isDragging.current = true;
        hasMoved.current = true;
        
        // Add user-select: none to prevent selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
      }

      if (isDragging.current) {
        const rotation = lastRotation.current + deltaX * sensitivity;
        rotate.set(rotation);
        
        // Prevent default to avoid scrolling/selection
        e.preventDefault();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging.current) {
        lastRotation.current = rotate.get();
        
        // Restore user selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      }

      // If we haven't moved much, allow normal click behavior
      if (!hasMoved.current) {
        // Allow the click to propagate normally
        const target = e.target as HTMLElement;
        if (target.matches('a, button, [role="button"], [onclick]')) {
          // Let the click event fire naturally
        }
      }

      pointerStart.current = null;
      isDragging.current = false;
      hasMoved.current = false;
    };

    const handlePointerCancel = () => {
      // Restore user selection on cancel
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      
      pointerStart.current = null;
      isDragging.current = false;
      hasMoved.current = false;
    };

    // Prevent context menu during drag
    const handleContextMenu = (e: Event) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    // Prevent drag on images and other draggable elements
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerup", handlePointerUp);
    el.addEventListener("pointercancel", handlePointerCancel);
    el.addEventListener("pointerleave", handlePointerUp);
    el.addEventListener("contextmenu", handleContextMenu);
    el.addEventListener("dragstart", handleDragStart);

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointercancel", handlePointerCancel);
      el.removeEventListener("pointerleave", handlePointerUp);
      el.removeEventListener("contextmenu", handleContextMenu);
      el.removeEventListener("dragstart", handleDragStart);
      
      // Cleanup in case component unmounts during drag
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [sensitivity, rotate, disabled, dragThreshold]);

  return (
    <div
      ref={containerRef}
      className={`
        inline-block 
        touch-none 
        ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
        ${disabled ? '' : 'select-none'}
      `}
      style={{
        // Prevent image dragging and selection
        // WebkitUserDrag: 'none',
        userSelect: disabled ? 'auto' : 'none',
        WebkitUserSelect: disabled ? 'auto' : 'none',
      }}
    >
      <motion.div 
        style={{ rotate }} 
        className="origin-center"
        // Prevent dragging on the motion div itself
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </motion.div>
    </div>
  );
};