import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";

function throttle(func: (...args: unknown[]) => void, limit: number) {
  let inThrottle: boolean;
  return function (this: unknown, ...args: unknown[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function Index({ children }: { children: React.ReactElement }) {
  const magnetic = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Tween | null>(null);
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    if (isTouchDevice) return;
    const element = magnetic.current;
    if (!element) return;

    const maxDistance = 20;

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

      const distance = Math.sqrt(x * x + y * y);
      if (distance > maxDistance) {
        const factor = maxDistance / distance;
        x *= factor;
        y *= factor;
      }

      return { x, y };
    };

    const mouseMove = throttle((e: unknown) => {
      const { x, y } = calculateMovement((e as MouseEvent).clientX, (e as MouseEvent).clientY);
      requestAnimationFrame(() => animate(x, y));
    }, 16);

    const mouseLeave = () => {
      requestAnimationFrame(() => animate(0, 0));
    };

    element.addEventListener("mousemove", mouseMove as EventListener);
    element.addEventListener("mouseleave", mouseLeave);

    return () => {
      element.removeEventListener("mousemove", mouseMove as EventListener);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, [isTouchDevice]);

  return React.cloneElement(children, { ref: magnetic });
}