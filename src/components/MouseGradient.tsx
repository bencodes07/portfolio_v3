import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import NavMenu from "./NavMenu";
import { Equal } from "lucide-react";
import { useScroll } from "framer-motion";

const MouseGradient: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [textColor, setTextColor] = useState<"white" | "transparent">("white");

  const { scrollY, scrollYProgress } = useScroll();

  const [springProps, setSpringProps] = useSpring(() => ({
    xy: [0, 0],
    config: config.gentle,
  }));

  const [buttonProps, setButtonProps] = useSpring(() => ({
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgba(0, 0, 0, 0)",
    config: config.gentle,
  }));

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setSpringProps({ xy: [ev.clientX, ev.clientY] });
    };

    const handleScroll = () => {
      if (scrollYProgress.get() > 0.2 && scrollYProgress.get() < 0.4) {
        const t = (scrollYProgress.get() - 0.2) / 0.2; // normalize to 0-1
        setButtonProps({
          color: `rgb(${Math.round(255 * (1 - t))}, ${Math.round(
            255 * (1 - t)
          )}, ${Math.round(255 * (1 - t))})`,
          backgroundColor: `rgba(255, 255, 255, ${t})`,
        });
        setTextColor("transparent");
      } else if (scrollYProgress.get() <= 0.2) {
        setTextColor("white");
        setButtonProps({
          color: "rgb(255, 255, 255)",
          backgroundColor: "rgba(0, 0, 0, 0)",
        });
      } else if (scrollYProgress.get() >= 0.4) {
        setButtonProps({
          color: "rgb(0, 0, 0)",
          backgroundColor: "rgb(255, 255, 255)",
        });
        setTextColor("transparent");
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setSpringProps, setButtonProps]);

  return (
    <>
      <animated.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          background: springProps.xy.to(
            (x, y) =>
              `radial-gradient(${
                window.innerWidth / 3
              }px at ${x}px ${y}px, rgba(190, 190, 255, 0.09), transparent 50%)`
          ),
        }}
      />

      <div>
        <button
          className="fixed top-6 right-16 z-40 px-4 py-2 text-xl poppins-regular flex flex-row gap-x-2 items-center"
          style={{ color: textColor }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          menu
        </button>

        <animated.button
          style={{
            position: "fixed",
            right: "1.5rem",
            zIndex: 40,
            padding: "0.5rem 1rem",
            color: buttonProps.color,
          }}
          className="fixed top-6 right-16 z-40 px-4 py-2 text-light text-xl poppins-regular flex flex-row gap-x-2 items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Equal size={32} />
        </animated.button>
      </div>
      <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default MouseGradient;
