import { type ReactNode, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useGetLandingLoadedStatus from "../../../contexts/hooks/use";
import useSmoothScroll, {
  useScrollerProxyUpdate,
} from "../../../hooks/animated/useSmoothScroll";
import "../../../style/Banner.css";
import XSpacing from "../../../components/wrappers/XSpacing";

gsap.registerPlugin(ScrollTrigger);

const HomeLoading = ({ children }: { children: ReactNode }) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const overlayEl = useRef<HTMLDivElement>(null);
  const bannerEl = useRef<HTMLDivElement>(null);
  const leftEl = useRef<HTMLDivElement>(null);
  const rightEl = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const { lenisInstance } = useSmoothScroll({
    autoInit: false,
    shouldEnableLenis: false,
  });

  useScrollerProxyUpdate(containerEl, lenisInstance);
  const { setLoaded } = useGetLandingLoadedStatus();

  useGSAP(
    () => {
      if (
        !containerEl.current ||
        !overlayEl?.current ||
        !bannerEl?.current ||
        !leftEl?.current ||
        !rightEl?.current
      ) {
        return;
      } else {
        console.log(isAnimating);
        // ScrollTrigger.refresh();
        // const tl = gsap.timeline({
        //   scrollTrigger: {
        //     trigger: containerEl?.current,
        //     start: "top top",
        //     end: "bottom top",
        //     pin: containerEl?.current,
        //     pinSpacing: true,
        //     scrub: 3.5,
        //     markers: true,
        //     onUpdate: (self) => {
        //       const prog = self?.progress;
        //       if (prog >= 0.99) {
        //         setLoaded(true);
        //       } else {
        //         setLoaded(false);
        //       }
        //     },
        //     onEnter: () => {
        //       gsap.set(containerEl?.current, { zIndex: 9999 });
        //       setLoaded(false);
        //       setIsAnimating(true);
        //     },
        //     onLeave: () => {
        //       gsap.set(containerEl?.current, { zIndex: 9 });
        //       setLoaded(true);
        //       setIsAnimating(false);
        //     },
        //     onEnterBack: () => {
        //       gsap.set(containerEl?.current, { zIndex: 9999 });
        //       setLoaded(false);
        //       setIsAnimating(true);
        //     },
        //     onLeaveBack: () => {
        //       gsap.set(containerEl?.current, { zIndex: 9 });
        //       setLoaded(true);
        //       setIsAnimating(false);
        //     },
        //   },
        // });
        // tl?.to(leftEl?.current, {
        //   left: "-100%",
        //   duration: 1,
        // })
        //   ?.to(
        //     rightEl?.current,
        //     {
        //       right: "-100%",
        //       duration: 1,
        //     },
        //     "<"
        //   )
        //   ?.to(containerEl?.current, {
        //     zIndex: 9,
        //     duration: 1,
        //   });

        ScrollTrigger.create({
          trigger: containerEl?.current,
          start: "top top",
          end: "bottom top",
          pin: containerEl?.current,
          scrub: true,
          // markers: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(leftEl?.current, {
              left: `${-100 * progress}%`,
            });
            gsap.to(rightEl?.current, {
              right: `${-100 * progress}%`,
            });
            if (progress >= 0.99) {
              setLoaded(true);
            } else {
              setLoaded(false);
            }
          },
          onEnter: () => {
            gsap.set(containerEl?.current, { zIndex: 9999 });
            setLoaded(false);
            setIsAnimating(true);
          },
          onLeave: () => {
            gsap.set(containerEl?.current, { zIndex: 9 });
            setLoaded(true);
            setIsAnimating(false);
          },
          onEnterBack: () => {
            // gsap.set(containerEl?.current, { zIndex: 9999 });
            setLoaded(false);
            setIsAnimating(true);
          },
          onLeaveBack: () => {
            gsap.set(containerEl?.current, { zIndex: 9 });
            setLoaded(true);
            setIsAnimating(false);
          },
        });
      }
    },
    {
      scope: containerEl,
      dependencies: [
        containerEl,
        overlayEl,
        bannerEl,
        leftEl,
        rightEl,
        lenisInstance,
      ],
    }
  );

  return (
    <>
      <div
        ref={containerEl}
        className="w-full flex flex-col h-[clamp(450px,100vh,1200px)]    relative "
      >
        <XSpacing className="relative h-[clamp(450px,100vh,1200px)] ">
          <div
            ref={overlayEl}
            className="w-full h-[clamp(450px,100vh,1200px)]  flex items-center justify-center  z-[9]  absolute top-0 inset-0  "
          >
            <div
              ref={leftEl}
              className="w-1/2 absolute left-0 top-0 h-full bg-icm-white flex flex-col items-center justify-center "
            >
              {/* Bottom left SVG corner */}
              <div className="absolute top-0  rotate-180 left-12/12 w-[40px] h-[40px] z-10 pointer-events-none">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="block"
                >
                  <path
                    d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z"
                    fill="#F4F5F5" // or bg color
                  />
                </svg>
              </div>
              <div className="w-fit h-fit flex pt-15 flex-col absolute top-1/2 left-1/2 -translate-1/2">
                <p className="text-[clamp(40px,3vw,120px)] indent-2 leading-none text-left whitespace-nowrap text-icm-black font-black ">
                  Blossom Coder is a{" "}
                </p>
                <p className="text-[clamp(100px,9vw,180px)] leading-none text-left  text-icm-primary font-black uppercase ">
                  Creative{" "}
                </p>
                <p className="text-[clamp(40px,3vw,120px)] indent-2 leading-none text-left whitespace-nowrap text-icm-black font-black ">
                  Agency
                </p>
                <p className="text-icm-black hidden text-md mt-5">
                  With an awesome working environment and a high degree of
                  proficiency we at Blossom Coder are Creative and innovative
                  members highly skilled in Website design & Development. We are
                  having more than 10 years of Experience and always up to take
                  coding challenges as per custom made client requirements. We
                  believe in delivering 100% accurate website solutions and rich
                  experience in e-commerce websites.
                </p>
                <div className="w-full h-fit mt-14">
                  <img
                    src="https://blossomcoder.com/wp-content/uploads/2022/12/pt-logos.png"
                    alt="Web Development"
                    className="w-full object-contain h-auto"
                  ></img>
                </div>
              </div>
            </div>
            <div
              ref={rightEl}
              className="w-1/2 absolute right-0 top-0 h-full  bg-transparent flex flex-col"
            >
              <div className="absolute top-0 rotate-90 right-0 w-[40px] h-[40px] z-10 pointer-events-none">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="block rotate-180"
                >
                  <path
                    d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z"
                    fill="#F4F5F5"
                  />
                </svg>
              </div>
              <div className="w-full h-3/4 bg-transparent bg"></div>
              <div className="w-full h-1/4 flex flex-wrap-reverse  ">
                <div className="relative w-1/2 h-full bg-cover bg-center">
                  {/* Bottom left SVG corner */}
                  <div className="absolute bottom-0 rotate-90 left-0 w-[40px] h-[40px] z-10 pointer-events-none">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="block"
                    >
                      <path
                        d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z"
                        fill="#F4F5F5" // or bg color
                      />
                    </svg>
                  </div>

                  {/* Bottom right SVG corner */}
                  <div className="absolute bottom-0 rotate-180 right-0 w-[40px] h-[40px] z-10 pointer-events-none">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="block rotate-180"
                    >
                      <path
                        d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z"
                        fill="#F4F5F5"
                      />
                    </svg>
                  </div>
                </div>

                <div className="w-1/2 h-full  flex-col bg-icm-white rounded-l-[32px] rounded-b-[0] flex items-start px-8 justify-center">
                  <div className="w-full  py-4">
                    <span className="inline text-h6 font-stretch-semi-expanded font-semibold text-icm-primary">
                      Coding Made Simple,
                    </span>
                    <span className="inline text-h6 font-stretch-semi-expanded font-semibold text-icm-secondary">
                      With Blossom Coder By Your Side.
                    </span>
                  </div>
                  <div className="w-fit h-fit px-4 py-4 rounded-[22px] bg-icm-primary hover:bg-icm-secondary text-white font-semibold text-icm-text-md cursor-pointer flex items-center justify-center">
                    Submit your request
                  </div>
                </div>
              </div>
              <div className="w-full h-10 bg-icm-white"></div>
            </div>
          </div>
          <div
            ref={bannerEl}
            className="absolute top-0 left-0 w-full h-full flex min-h-fit"
          >
            {children}
          </div>
        </XSpacing>
      </div>
      <div className="flex"></div>
    </>
  );
};

export default HomeLoading;
