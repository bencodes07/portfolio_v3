import { MotionValue, motion, useAnimationControls } from "framer-motion";
import { Linkedin, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Magnetic from "../Magnetic";

type ContactSectionProps = {
  isContactInView: boolean;
  isMobile: boolean;
  backgroundGradient: MotionValue<string>;
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: custom * 0.2,
    },
  }),
};

const Contact: React.FC<ContactSectionProps> = ({
  isContactInView,
  isMobile,
}) => {
  const contactControls = useAnimationControls();

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isContactInView && !hasAnimated) {
      contactControls.start("visible");
      setHasAnimated(true);
    } else if (!isContactInView && hasAnimated) {
      contactControls.start("hidden");
      setHasAnimated(false);
    }
  }, [isContactInView, contactControls, hasAnimated, setHasAnimated]);
  return (
    <motion.div
      animate={contactControls}
      initial={"hidden"}
      className={`w-screen contact-bg ${isMobile ? "before:bg-none after:bg-none" : "before:block after:block"} min-h-screen overflow-hidden flex flex-col justify-end items-center gap-y-4 relative z-[2]`}
    >
      <motion.h2
        custom={0}
        variants={fadeInUpVariants}
        className="poppins-medium text-2xl text-gray-3 px-4 text-center"
      >
        Want to collaborate?
      </motion.h2>
      <motion.h1
        custom={1}
        variants={fadeInUpVariants}
        className="khula-semibold text-7xl text-center px-4"
      >
        Let's have a chat!
      </motion.h1>
      <motion.div
        custom={2}
        variants={fadeInUpVariants}
        className="flex flex-row gap-x-6 items-center mt-[14vh]"
      >
        <Magnetic>
          <a
            href="mailto:info@bencodes.de"
            className="flex gap-x-2 rounded-full border-dark border-2 px-2 py-1"
          >
            <Mail />
            Email
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="tel:+4917621577766"
            className="flex gap-x-2 rounded-full border-dark border-2 px-2 py-1"
          >
            <Phone />
            Phone
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="https://linkedin.com/in/ben-böckmann-296293265"
            target="_blank"
            className="flex gap-x-2 rounded-full border-dark border-2 px-2 py-1"
          >
            <Linkedin />
            LinkedIn
          </a>
        </Magnetic>
      </motion.div>
      <motion.div
        custom={3}
        variants={fadeInUpVariants}
        className="flex flex-col items-center mt-[5vh]"
      >
        <p className="poppins-regular text-2xl">bb</p>
        <p className="poppins-extralight text-2xl">Ben Böckmann</p>

        <p className="poppins-light px-4 text-gray-3 tracking-[calc(-1rem*0.03)] mt-[8vh] select-none mb-1 text-center">
          © Ben Böckmann 2024. All rights reserved. Location: Germany
        </p>
        <p className="poppins-light px-4 text-gray-3 select-none tracking-[calc(-1rem*0.03)] mb-8 max-w-[500px] text-center">
          This site showcases my personal projects and professional work.
          Content may not be used without permission.
        </p>
      </motion.div>
    </motion.div>
  );
};
export default Contact;
