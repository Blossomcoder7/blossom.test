import clsx from "clsx";
import {
  forwardRef,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { IconButton, Drawer as MUIDrawer } from "@mui/material";
import { type DrawerProps as MUIDrawerProps } from "@mui/material";
import { IoClose } from "react-icons/io5";
import useSmoothScroll from "../../hooks/animated/useSmoothScroll";

export interface DrawerRefType {
  open: () => void;
  close: () => void;
}
export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  muiDrawerProps: Omit<MUIDrawerProps, "open"> | undefined;
  menu: ReactNode | undefined;
}
const Drawer = forwardRef(
  (
    {
      children,
      className,
      onClick,
      menu,
      muiDrawerProps,
      ...rest
    }: DrawerProps,
    ref
  ) => {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const { start, stop, refresh } = useSmoothScroll({});

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
      onClick?.(e);
      stop();
    };
    const handleClose = () => {
      setOpenDrawer(false);
      start();
      refresh();
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        stop();
        setOpenDrawer(true);
      },
      close: () => {
        handleClose();
        setOpenDrawer(false);
      },
    }));

    const { changeTarget, retrigger } = useSmoothScroll({});
    const paperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!paperRef?.current) {
        return;
      }
      if (openDrawer) {
        changeTarget(paperRef?.current);
      } else {
        retrigger();
      }
    }, [paperRef, changeTarget, retrigger, openDrawer]);

    return (
      <>
        <div
          {...rest}
          onClick={handleClick}
          className={clsx(
            className,
            `lg:hidden inline-flex items-center justify-center w-fit h-screen max-h-[100svh]`
          )}
        >
          {menu}
        </div>
        <div
          className={clsx(
            `hidden lg:flex flex-row justify-center items-center flex-1 w-full h-full`
          )}
        >
          {children}
        </div>

        <MUIDrawer
          {...muiDrawerProps}
          open={openDrawer}
          variant="temporary"
          onClose={() => handleClose()}
          disableScrollLock={true}
          slotProps={{
            paper: {
              sx: {
                width: 300,
                background: "white",
              },
              className: `flex flex-col justify-start items-center space-y-3 relative max-h-[100svh] overflow-hidden`,
            },
          }}
        >
          <div className="relative w-full h-full max-h-[100svh]">
            <IconButton
              sx={{
                p: 0.5,
                color: "white",
                position: "absolute",
                top: 20,
                right: 20,
                "&:hover": {
                  color: "red",
                },
              }}
              onClick={() => handleClose()}
            >
              <IoClose className="text-[clamp(20px,2rem,22px)] text-icm-primary hover:text-icm-secondary" />
            </IconButton>
            <div
              ref={paperRef}
              className="w-full h-screen max-h-[100svh] overflow-auto flex flex-col py-10 bg-icm-white"
            >
              <div className="min-h-fit flex flex-col w-full ">{children}</div>
            </div>
          </div>
        </MUIDrawer>
      </>
    );
  }
);

Drawer.displayName = "Drawer";
export default Drawer;
