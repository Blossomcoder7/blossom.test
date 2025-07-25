"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, type RefObject } from "react";

export type Alignment =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface useFollowMouseLocationProps {
  ref: RefObject<HTMLDivElement | null>;
  container: RefObject<HTMLDivElement | null>;
  stiffness?: number;
  damping?: number;
  padding?: number;
  alignment?: Alignment;
  shouldIncludePaddingInBounds?: boolean;
}
/**
 * A hook that makes an element follow the mouse position, with a spring animation.
 *
 * The element is kept within the bounds of the container, and can be aligned
 * to the center, top, bottom, left, right, or any of the four corners.
 *
 * @param {Object} props
 * @prop {RefObject<HTMLDivElement | null>} ref - The element to move
 * @prop {RefObject<HTMLDivElement | null>} container - The element to attach the mouse trigger to
 * @prop {Object} [options={}] - Optional configuration options
 * @prop {number} [options.stiffness=120] - The stiffness of the spring
 * @prop {boolean} [shouldIncludePaddingInBounds=true] - wheter to bound withing padding of the parent
 * @prop {number} [options.damping=20] - The damping of the spring
 * @prop {number} [options.padding=20] - The padding to keep the box inside the container
 * @prop {Alignment} [options.alignment="center"] - The alignment of the box within the container
 * @prop {"window" | "elm"} [listener="window"] - Whether to listen to mouse events on the window or the container element
 *
 * @returns {Object} An object with two properties: springX and springY, which are
 * MotionValues that represent the x and y positions of the element.
 */
const useFollowMouseLocation = (
  {
    container,
    ref,
    alignment = "center",
    damping = 20,
    padding = 20,
    stiffness = 120,
    shouldIncludePaddingInBounds = true,
  }: useFollowMouseLocationProps,
  listener?: "window" | "elm"
) => {
  const x = useMotionValue<number>(0);
  const y = useMotionValue<number>(0);
  const springX = useSpring(x, { stiffness, damping, mass: 1, bounce: 1 });
  const springY = useSpring(y, { stiffness, damping, mass: 1, bounce: 1 });

  // Store last known mouse position
  const lastMousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Get real-time element dimensions
  const getElementDimensions = useCallback(() => {
    if (!ref?.current) return { width: 0, height: 0 };

    const elm = ref.current;
    const rect = elm.getBoundingClientRect();

    // If element is hidden or has no dimensions, use a default or computed style
    if (rect.width === 0 || rect.height === 0) {
      const computedStyle = window.getComputedStyle(elm);
      const width = parseFloat(computedStyle.width) || 300;
      const height = parseFloat(computedStyle.height) || 200;
      if (!shouldIncludePaddingInBounds) {
        return { width, height };
      } else {
        const paddingTop = Number(computedStyle.paddingTop) || 0;
        const paddingBottom = Number(computedStyle.paddingBottom) || 0;
        const paddingLeft = Number(computedStyle.paddingLeft) || 0;
        const paddingRight = Number(computedStyle.paddingRight) || 0;
        const maxWidth = width - (paddingLeft + paddingRight);
        const maxHeight = height - (paddingTop + paddingBottom);
        return { width: maxWidth, height: maxHeight };
      }
    }

    return { width: rect.width, height: rect.height };
  }, [ref, shouldIncludePaddingInBounds]);

  const applyAlignmentOffset = useCallback(
    (axis: "x" | "y", value: number, boxWidth: number, boxHeight: number) => {
      switch (alignment) {
        case "center":
          return axis === "x" ? value - boxWidth / 2 : value - boxHeight / 2;
        case "top":
          return axis === "x" ? value - boxWidth / 2 : value;
        case "bottom":
          return axis === "x" ? value - boxWidth / 2 : value - boxHeight;
        case "left":
          return axis === "x" ? value : value - boxHeight / 2;
        case "right":
          return axis === "x" ? value - boxWidth : value - boxHeight / 2;
        case "top-left":
          return value;
        case "top-right":
          return axis === "x" ? value - boxWidth : value;
        case "bottom-left":
          return axis === "x" ? value : value - boxHeight;
        case "bottom-right":
          return axis === "x" ? value - boxWidth : value - boxHeight;
        default:
          return value;
      }
    },
    [alignment]
  );

  // Update position with current dimensions
  const updatePosition = useCallback(() => {
    if (!ref?.current || !container?.current) return;

    const containerElm = container.current;
    const containerBounds = containerElm.getBoundingClientRect();
    const containerTop = containerBounds.top + window.scrollY;
    const containerLeft = containerBounds.left + window.scrollX;
    const containerWidth = containerBounds.width;
    const containerHeight = containerBounds.height;

    // Get current element dimensions
    const { width: boxWidth, height: boxHeight } = getElementDimensions();

    const rawX = lastMousePos.current.x + window.scrollX;
    const rawY = lastMousePos.current.y + window.scrollY;

    // Apply alignment offset
    const alignedX = applyAlignmentOffset("x", rawX, boxWidth, boxHeight);
    const alignedY = applyAlignmentOffset("y", rawY, boxHeight, boxHeight);

    // Calculate bounds with current dimensions
    const minX = containerLeft + padding;
    const maxX = containerLeft + containerWidth - padding - boxWidth;
    const minY = containerTop + padding;
    const maxY = containerTop + containerHeight - padding - boxHeight;

    // Ensure max values are not less than min values (when element is larger than container)
    const clampedMaxX = Math.max(maxX, minX);
    const clampedMaxY = Math.max(maxY, minY);

    // Clamp position to container bounds
    const finalX =
      Math.min(Math.max(alignedX, minX), clampedMaxX) - containerLeft;
    const finalY =
      Math.min(Math.max(alignedY, minY), clampedMaxY) - containerTop;

    x.set(finalX);
    y.set(finalY);
  }, [
    ref,
    container,
    padding,
    applyAlignmentOffset,
    getElementDimensions,
    x,
    y,
  ]);

  // Debounced position update using RAF
  const scheduleUpdate = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    rafId.current = requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    const cont = container?.current;
    if (!ref?.current || !container?.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Store mouse position
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      scheduleUpdate();
    };

    // Handle resize and scroll events to recalculate position
    const handleResize = () => {
      scheduleUpdate();
    };

    const handleScroll = () => {
      scheduleUpdate();
    };

    // Set up event listeners
    if (listener === "elm") {
      cont?.addEventListener("mousemove", handleMouseMove);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Also listen for when the element becomes visible or changes size
    let resizeObserver: ResizeObserver | null = null;
    if (ref.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        scheduleUpdate();
      });
      resizeObserver.observe(ref.current);
    }

    // Initial position update
    scheduleUpdate();

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      cont?.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [ref, container, listener, scheduleUpdate]);

  return {
    springX,
    springY,
  };
};

export default useFollowMouseLocation;
