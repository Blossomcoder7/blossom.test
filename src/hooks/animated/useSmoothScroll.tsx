import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type RefObject,
} from "react";
import Lenis, { type LenisOptions } from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  shouldEnableLenis?: boolean;
  lenisOptions?: LenisOptions;
  autoInit?: boolean; // Whether to auto-initialize on mount
};

export default function useSmoothScroll({
  shouldEnableLenis = true,
  lenisOptions = {},
  autoInit = true,
}: Props) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLenisEnabled, setIsLenisEnabled] = useState(shouldEnableLenis);
  const lenisInstancesRef = useRef<Map<string, Lenis>>(new Map());
  const rafRef = useRef<((time: number) => void) | null>(null);

  // ---- CLEANUP ----
  const cleanupAll = useCallback(() => {
    if (rafRef.current) {
      gsap.ticker.remove(rafRef.current);
      rafRef.current = null;
    }
    lenisInstancesRef.current.forEach((lenis) => {
      lenis.destroy();
    });
    lenisInstancesRef.current.clear();
    setIsInitialized(false);
  }, []);

  // ---- INITIALIZE LENIS ----
  const initLenis = useCallback(
    (target?: HTMLElement, instanceId: string = "default") => {
      if (!isLenisEnabled) return null;
      const existingInstance = lenisInstancesRef.current.get(instanceId);
      if (existingInstance) existingInstance.destroy();
      const wrapper = target || document.documentElement;
      const content = target
        ? (target.firstElementChild as HTMLElement)
        : document.body;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        ...lenisOptions,
        wrapper,
        content,
      });
      if (!rafRef.current) {
        const raf = (time: number) => {
          lenisInstancesRef.current.forEach((lenisInstance) => {
            lenisInstance.raf(time * 1000);
          });
        };
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        rafRef.current = raf;
      }
      lenis.on("scroll", ScrollTrigger.update);
      lenisInstancesRef.current.set(instanceId, lenis);
      setIsInitialized(true);
      return lenis;
    },
    [isLenisEnabled, lenisOptions]
  );

  // ---- AUTO INIT / CLEANUP EFFECT ----
  useEffect(() => {
    if (autoInit && isLenisEnabled) {
      initLenis();
    }
    return cleanupAll;
  }, [initLenis, cleanupAll, autoInit, isLenisEnabled]);

  // ---- CREATE/REMOVE/GET INSTANCES ----
  const createInstance = useCallback(
    (target: HTMLElement, instanceId?: string) => {
      const id = instanceId || `instance_${Date.now()}`;
      return initLenis(target, id);
    },
    [initLenis]
  );
  const removeInstance = useCallback((instanceId: string) => {
    const instance = lenisInstancesRef.current.get(instanceId);
    if (instance) {
      instance.destroy();
      lenisInstancesRef.current.delete(instanceId);
    }
  }, []);
  const getInstance = useCallback((instanceId: string = "default") => {
    return lenisInstancesRef.current.get(instanceId) || null;
  }, []);

  // ---- START/STOP/REFRESH ----
  const refresh = useCallback(() => {
    lenisInstancesRef.current.forEach((lenis) => {
      lenis.resize();
    });
    ScrollTrigger.refresh();
  }, []);
  const stop = useCallback(() => {
    lenisInstancesRef.current.forEach((lenis) => {
      lenis.stop();
    });
  }, []);
  const start = useCallback(() => {
    lenisInstancesRef.current.forEach((lenis) => {
      lenis.start();
    });
  }, []);

  // ---- ENABLE/DISABLE LENIS (THE KEY METHODS) ----

  // Disable (fully destroy) all Lenis, remove rAF, return to native scroll
  const disableLenis = useCallback(() => {
    cleanupAll();
    setIsLenisEnabled(false);
    setIsInitialized(false);
    ScrollTrigger.refresh();
  }, [cleanupAll]);

  // Enable Lenis again (re-init, optionally pass new options)
  const enableLenis = useCallback(() => {
    setIsLenisEnabled(true);
    setTimeout(() => {
      // Wait for React state to settle
      cleanupAll();
      initLenis(undefined, "default");
      ScrollTrigger.refresh();
    }, 0);
  }, [cleanupAll, initLenis]);

  return {
    isLenisEnabled,
    isInitialized,
    createInstance,
    removeInstance,
    getInstance,
    refresh,
    stop,
    start,
    cleanupAll,
    enableLenis,
    disableLenis,
    changeTarget: createInstance,
    lenisInstance: getInstance(),
    retrigger: refresh,
  };
}

export function useScrollerProxyUpdate(
  containerEl: RefObject<HTMLDivElement | null> | null,
  lenisInstance: Lenis | null
) {
  if (!lenisInstance || !containerEl?.current) {
    return;
  }
  ScrollTrigger.scrollerProxy(containerEl?.current, {
    scrollTop(value) {
      if (arguments.length) {
        lenisInstance?.scrollTo(value!);
      }
      return lenisInstance?.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: containerEl.current?.style.transform ? "transform" : "fixed",
  });
  ScrollTrigger.refresh();
}
