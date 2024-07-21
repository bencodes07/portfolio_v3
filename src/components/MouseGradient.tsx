import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const MouseGradient: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
  );
};

export default MouseGradient;
