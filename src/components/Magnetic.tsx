import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";

// Utility function for throttling
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function Index({ children }: { children: JSX.Element }) {
  const magnetic = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Tween | null>(null);
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    if (isTouchDevice) return;
    const element = magnetic.current;
    if (!element) return;

    const maxDistance = 20; // Maximum pixel distance to move

    const animate = (x: number, y: number) => {
      if (animation.current) {
        animation.current.kill();
      }
      animation.current = gsap.to(element, {
        x,
        y,
        duration: 0.7,
        ease: "power2.out",
      });
    };

    const calculateMovement = (clientX: number, clientY: number) => {
      const { height, width, left, top } = element.getBoundingClientRect();
      let x = clientX - (left + width / 2);
      let y = clientY - (top + height / 2);

      // Limit the movement range
      const distance = Math.sqrt(x * x + y * y);
      if (distance > maxDistance) {
        const factor = maxDistance / distance;
        x *= factor;
        y *= factor;
      }

      return { x, y };
    };

    const mouseMove = throttle((e: MouseEvent) => {
      const { x, y } = calculateMovement(e.clientX, e.clientY);
      requestAnimationFrame(() => animate(x, y));
    }, 16); // Throttle to about 60fps

    const mouseLeave = () => {
      requestAnimationFrame(() => animate(0, 0));
    };

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);

    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, [isTouchDevice]);

  return React.cloneElement(children, { ref: magnetic });
}
