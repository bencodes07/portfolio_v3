import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import NavMenu from "./NavMenu";

const MouseGradient: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const springProps = useSpring({
    xy: [mousePosition.x, mousePosition.y],
    config: { mass: 10, tension: 550, friction: 140 },
  });

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
            (x: number, y: number) =>
              `radial-gradient(${
                window.innerWidth / 3
              }px at ${x}px ${y}px, rgba(190, 190, 255, 0.09), transparent 50%)`
          ),
        }}
      />
      <button
        className="fixed top-6 right-6 z-40 px-4 py-2 text-light text-xl poppins-regular flex flex-row gap-x-2 items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        menu{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-equal"
        >
          <line x1="5" x2="19" y1="9" y2="9" />
          <line x1="5" x2="19" y1="15" y2="15" />
        </svg>
      </button>
      <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default MouseGradient;
