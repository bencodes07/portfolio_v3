import { MotionValue, motion } from "framer-motion";

type ContactSectionProps = {
  isContactInView: boolean;
  isMobile: boolean;
  backgroundGradient: MotionValue<string>;
};

const Contact: React.FC<ContactSectionProps> = ({
  isContactInView,
  isMobile,
  backgroundGradient,
}) => {
  return (
    <motion.div
      style={{ background: backgroundGradient }}
      className="w-screen min-h-screen overflow-hidden flex justify-center items-center relative z-10"
    >
      <h1>Do you have an idea? Let's talk!</h1>
    </motion.div>
  );
};
export default Contact;
