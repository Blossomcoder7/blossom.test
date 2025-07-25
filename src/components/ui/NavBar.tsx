import logo from "/logo/brand.png";
import { IconButton } from "@mui/material";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";
import MagicScrollWrapper from "../animated/MagicScrollWrapper";
import clsx from "clsx";
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import type { DrawerRefType } from "../wrappers/Drawer";
import XSpacing from "../wrappers/XSpacing";
import Drawer from "../wrappers/Drawer";
import { Link } from "react-router";

const NavBar = () => {
  const drawerEl = useRef<DrawerRefType>(null);
  const { scrollY } = useScroll();
  const controls = useAnimation();
  const [scrolled, setScrolled] = useState(false);
  

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 400);
  });

  useEffect(() => {
    controls.start({
      y: scrolled ? 0 : -100,
      opacity: scrolled ? 1 : 0,
      transition: {
        duration: 0.6,
        ease: [0.77, 0, 0.175, 1],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrolled]);

  return (
    <MagicScrollWrapper>
      <nav
        className={clsx(
          " navbar w-full lg:py-4 items-center relative  justify-center flex   text-mw-sm overflow-hidden h-full"
        )}
      >
        <motion.div
          animate={controls}
          className="w-full  absolute inset-0 top-0 left-0 bg-icm-secondary/10 backdrop-blur-[1px] z-1"
        />
        <XSpacing>
          <div className="flex items-center h-full justify-between w-full relative z-2 rounded-md  ">
            {/* Mobile logo */}
            <div className="lg:hidden h-full">
              <Logo />
            </div>
            {/* Right section with Drawer/Menu */}
            <div className="w-fit lg:w-full h-full">
              <Drawer
                ref={drawerEl}
                muiDrawerProps={{
                  anchor: "right",
                  disableScrollLock: true,
                }}
                menu={
                  <IconButton
                    className=" text-[clamp(20px,4vw,28px)] "
                    sx={{ p: 2 }}
                    onClick={() => drawerEl?.current?.open?.()}
                  >
                    <HiOutlineBars3 className=" text-icm-primary hover:text-icm-secondary" />
                  </IconButton>
                }
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full h-full  lg:mt-0 space-y-6 lg:space-y-0 ">
                  {/* Desktop Logo */}
                  <div className="hidden lg:flex items-center justify-center w-fit h-full">
                    <Logo />
                  </div>

                  {/* Nav Links */}
                  <div className="flex flex-col lg:flex-row items-center justify-center flex-1 space-y-6 lg:space-y-0 lg:space-x-8">
                    {[
                      { name: "Home", link: "/" },
                      { name: "Services", link: "" },
                      { name: "Projects", link: "" },
                      { name: "Hire Us", link: "" },
                      { name: "Careers", link: "" },
                      { name: "Contact Us", link: "" },
                    ].map((label, i) => {
                      return (
                        <Link
                          to={label.link}
                          key={`nav-links-items-items-${i}`}
                        >
                          <button
                            type="button"
                            className=" hover:text-icm-secondary text-center text-icm-primary font-medium cursor-pointer text-mw-text-md"
                          >
                            {label.name}
                          </button>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Icons */}
                  <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-6">
                    <div className="flex font-bold text-sm lg:text-base bg-icm-primary text-icm-white px-6 py-2 rounded-full cursor-pointer border-2 border-transparent transition duration-200  hover:text-icm-white hover:bg-icm-secondary hover:border-icm-secondary hover:bg-icm-border-icm-secondary">
                      Request A Quote
                    </div>
                  </div>
                </div>
              </Drawer>
            </div>
          </div>
        </XSpacing>
      </nav>
    </MagicScrollWrapper>
  );
};

export default NavBar;

const Logo = () => {
  return (
    <Link to={"/"} className="flex items-center justify-center w-fit h-full">
      <img
        src={logo}
        alt="logo"
        className="object-contain h-[45px] sm:h-[55px] object-center"
      />
      <div className="flex flex-col ms-0.5">
        <span className="text-icm-primary leading-none font-black text-h6-m sm:text-h5">
          Blossom
        </span>
        <span className="text-icm-secondary leading-none font-black text-h6-m sm:text-h5">
          Coder
        </span>
      </div>
    </Link>
  );
};
