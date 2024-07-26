import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./assets/globals.scss";
import Navbar from "./components/hero/Navbar";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import MouseGradient from "./components/MouseGradient";
import { debounce } from "lodash";
import BackgroundSVG from "./components/hero/BackgroundSVG";
import About from "./components/about";
import { useColorAnimation } from "./hooks/useColorAnimation";

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const aboutRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isMobile = useMemo(() => window.innerWidth <= 768, []);

  // ----- Dimesion update ----- //
  const updateDimensions = useCallback(
    debounce(() => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      dimensionsRef.current = newDimensions;
      setDimensions(newDimensions);
    }, 200),
    []
  );

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // ----- Scroll animations ----- //
  const { scrollYProgress } = useScroll();
  const backgroundGradient = useMotionValue(
    "radial-gradient(circle, #111111 0%, #000000 65%)"
  );
  const textColor = useMotionValue("#FFFFFF");
  const svgOpacity = useMotionValue(1);

  const handleScroll = useCallback((latest: number) => {
    requestAnimationFrame(() => {
      const progress = Math.max(0, Math.min((latest - 0.1) / 0.2, 1));

      const startColor = [0, 0, 0];
      const endColor = [255, 255, 255]; // #FFFFFF

      const interpolateColor = (start: number[], end: number[]): string =>
        start
          .map((channel, i) =>
            Math.round(channel + (end[i] - channel) * progress)
          )
          .join(", ");

      const newGradient = `radial-gradient(circle, rgb(${interpolateColor(
        [17, 17, 17],
        endColor
      )}) 0%, rgb(${interpolateColor(startColor, endColor)}) 65%)`;
      backgroundGradient.set(newGradient);

      const txtColor = `rgb(${255 - Math.round(255 * progress)}, ${
        255 - Math.round(255 * progress)
      }, ${255 - Math.round(255 * progress)})`;
      textColor.set(txtColor);
      const newOpacity = 1 - progress;
      svgOpacity.set(newOpacity);
    });
  }, []);

  useMotionValueEvent(scrollYProgress, "change", handleScroll);

  useEffect(() => {
    if (window.innerWidth > 768) {
      (async () => {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        new LocomotiveScroll();
      })();
    }
  }, []);

  // ----- Color Animation ----- //
  const { hue1, hue2 } = useColorAnimation();

  return (
    <>
      <MouseGradient isMobile={isMobile} />
      <motion.div
        style={{ background: backgroundGradient }}
        className="w-screen overflow-hidden h-screen flex flex-col justify-center items-center "
      >
        <BackgroundSVG
          width={dimensions.width}
          height={dimensions.height}
          isMobile={isMobile}
          svgOpacity={svgOpacity}
        />
        <Navbar />
        <div className="flex justify-center items-center relative z-10">
          <motion.h1
            className="text-[80px] max-sm:text-[10vw] max-sm:max-w-sm max-sm:leading-tight text-light khula-extrabold w-[732px] text-center leading-[85px]"
            style={{
              transform: isMobile
                ? "none"
                : useTransform(
                    scrollYProgress,
                    [0, 0.5],
                    ["translateY(0px)", "translateY(-200px)"]
                  ),
              opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
              textShadow: "0px 0px 6px rgba(255,255,255,0.25)",
            }}
          >
            Turning ideas into{" "}
            <motion.span
              style={{
                backgroundImage: useTransform(
                  [hue1, hue2],
                  ([h1, h2]) =>
                    `linear-gradient(90deg, hsl(${h1}, 100%, 50%), hsl(${h2}, 100%, 50%))`
                ),
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              creative
            </motion.span>{" "}
            solutions.
          </motion.h1>
        </div>
      </motion.div>
      <div ref={aboutRef}>
        <About
          isAboutInView={useInView(aboutRef, { amount: 0.3 })}
          hasAnimated={hasAnimated}
          setHasAnimated={setHasAnimated}
          isMobile={isMobile}
          backgroundGradient={backgroundGradient}
        />
      </div>

      {/* Add some blank space */}
      <div style={{ height: "100vh", background: "#ffffff" }} />
    </>
  );
}

export default App;
