import React, { type ReactNode, type HTMLAttributes } from "react";
import "../../style/AnimatedText.css";

interface AnimatedTextProps extends HTMLAttributes<HTMLSpanElement> {
  children?: string | ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  disabled = false,
  speed = 5000,
  className = "",
  color,
  ...rest
}) => {
  const animationDuration = `${speed}ms`;

  return (
    <span
      {...rest}
      className={` bg-clip-text inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, ${color} 50%, rgba(255, 255, 255, 0) 60%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {children}
    </span>
  );
};

export default AnimatedText;
