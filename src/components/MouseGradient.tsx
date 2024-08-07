import { useState, useEffect, useRef } from "react";
import { useSpring, animated, config } from "react-spring";
import NavMenu from "./NavMenu";
import { Equal } from "lucide-react";
import {useScroll, useTransform, motion} from "framer-motion";
import gsap from "gsap";

const MouseGradient = ({ isMobile }: { isMobile: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [textColor, setTextColor] = useState<"white" | "transparent">("white");
  const gradientRef = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Tween | null>(null);

  const { scrollYProgress, scrollY } = useScroll();

  const gradientOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  const [buttonProps, setButtonProps] = useSpring(() => ({
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgba(0, 0, 0, 0)",
    config: config.gentle,
  }));

  useEffect(() => {
    const element = gradientRef.current;
    if (!element) return;

    const maxDistance = 80; // Maximum pixel distance to move

    const animate = (x: number, y: number) => {
      if (animation.current) {
        animation.current.kill();
      }
      animation.current = gsap.to(element, {
        x,
        y,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const calculateMovement = (clientX: number, clientY: number) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      let x = (clientX - centerX) / 10;
      let y = (clientY - centerY) / 10;

      // Limit the movement range
      const distance = Math.sqrt(x * x + y * y);
      if (distance > maxDistance) {
        const factor = maxDistance / distance;
        x *= factor;
        y *= factor;
      }

      return { x, y };
    };

    const mouseMove = (e: MouseEvent) => {
      const { x, y } = calculateMovement(e.clientX, e.clientY);
      requestAnimationFrame(() => animate(x, y));
    };

    const mouseLeave = () => {
      requestAnimationFrame(() => animate(0, 0));
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseleave", mouseLeave);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  useEffect(() => {
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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setButtonProps]);

  return (
    <>
          <motion.div
              ref={gradientRef}
              style={{
                position: window.innerWidth > 768 ? "fixed" : "absolute",
                top: "50%",
                left: "50%",
                width: `${
                    !isMobile ? Math.min(window.innerWidth, window.innerHeight) : 0
                }px`,
                height: `${
                    !isMobile ? Math.min(window.innerWidth, window.innerHeight) : 0
                }px`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 0,
                opacity: gradientOpacity,
                background: `radial-gradient(circle, rgba(190, 190, 255, 0.06) 0%, transparent 50%)`,
              }}
          />

      <div>
        {window.innerWidth > 768 && (
          <button
            className="fixed top-6 right-16 z-40 px-4 py-2 text-xl poppins-regular flex flex-row gap-x-2 items-center"
            style={{ color: textColor }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            menu
          </button>
        )}

        <animated.button
          style={{
            position: window.innerWidth > 768 ? "fixed" : "absolute",
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
