import { useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect } from "react";

export const useColorAnimation = () => {
  const baseHue = useMotionValue(0);

  const mapHue = useCallback((h: number) => {
    // Map 0-360 to 0-270 (excluding yellow and green)
    h = h % 360;
    if (h < 60) return h; // Red to purple
    if (h < 180) return 60 + (h - 60) * (60 / 120); // Purple to blue
    return 120 + (h - 180) * (150 / 180); // Blue to red
  }, []);

  const hue1 = useTransform(baseHue, mapHue);
  const hue2 = useTransform(baseHue, (h) => mapHue((h + 60) % 360));

  useEffect(() => {
    const interval = setInterval(() => {
      baseHue.set(baseHue.get() - 1);
    }, 50);

    return () => clearInterval(interval);
  }, [baseHue]);

  return { hue1, hue2 };
};
