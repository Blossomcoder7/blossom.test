import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { useRef } from "react";

const Character = ({
  children,
  index = Math.max(Math.random() * 10, 10),
  className,
  end,
  start,
}: {
  children: string;
  index?: number;
  className?: string;
  start?: string;
  end?: string;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerEl = useRef<HTMLSpanElement>(null);
  const directionDown = index % 2 === 0;

  useGSAP(
    () => {
      if (!rootRef.current || !containerEl.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: start || "top-=150px top",
          end: end || "bottom+=150px center",
          scrub: 1.5,
          // markers: true,
        },
      });

      tl.to(containerEl.current, {
        y: directionDown ? "100%" : "-100%",
        transform: "translate3d(0px, 0px, 0px)",
        ease: "power1.out",
        // delay: `0.${index}`,
      });
    },
    { scope: rootRef, dependencies: [index] }
  );

  return (
    <div
      ref={rootRef}
      className={clsx(
        "  tracking-tight leading-[0.85] overflow-hidden  flex",
        className
      )}
    >
      <span
        ref={containerEl}
        className="relative inline-block will-change-transform"
        style={{
          display: "inline-block",
        }}
      >
        <span>{children}</span>
        <span
          className="absolute left-0"
          style={{
            bottom: directionDown ? "100%" : undefined,
            top: !directionDown ? "100%" : undefined,
          }}
        >
          {children}
        </span>
      </span>
    </div>
  );
};
export default Character;
