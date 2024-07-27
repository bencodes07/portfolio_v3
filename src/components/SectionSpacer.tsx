import { MotionValue, motion } from "framer-motion";

export default function SectionSpacer({
  backgroundGradient,
  height,
}: {
  backgroundGradient: MotionValue<string>;
  height: number;
}) {
  return (
    <motion.div
      style={{ height: height + "px", background: backgroundGradient }}
      className="w-screen border-none outline-none"
    ></motion.div>
  );
}
