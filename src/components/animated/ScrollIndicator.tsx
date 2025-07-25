import { motion, useScroll, useSpring } from "motion/react";
const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();

  const springX = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 120,
    mass: 1,
  });
  return (
    <div className="flex w-full h-1 bg-transparent">
      <motion.div
        style={{
          scaleX: springX,
        }}
        className="flex w-full origin-left bg-icm-primary"
      ></motion.div>
    </div>
  );
};

export default ScrollIndicator;
