import clsx from "clsx";
import React, { type ReactNode } from "react";

interface XSpacing
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  children: ReactNode;
  className?: string;
}
const XSpacing: React.FC<XSpacing> = (props) => {
  const { children, className, ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(
        `flex flex-col justify-center items-center w-full h-fit px-[15px] md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:max-w-[120rem] 2xl:mx-auto`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default XSpacing;
