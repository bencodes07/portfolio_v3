import { MotionValue, useAnimationControls, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import Magnetic from "../Magnetic";
import { useLenis } from "@studio-freight/react-lenis";

type AboutSectionProps = {
  isAboutInView: boolean;
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

const lineVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

const About: React.FC<AboutSectionProps> = ({
  isAboutInView,
  isMobile,
  backgroundGradient,
}) => {
  const aboutControls = useAnimationControls();

  const [hasAnimated, setHasAnimated] = useState(false);

  const lenis = useLenis();

  useEffect(() => {
    if (isAboutInView && !hasAnimated) {
      aboutControls.start("visible");
      setHasAnimated(true);
    } else if (!isAboutInView && hasAnimated) {
      aboutControls.start("hidden");
      setHasAnimated(false);
    }
  }, [isAboutInView, aboutControls, hasAnimated, setHasAnimated]);

  return (
    <motion.div
      style={{ background: backgroundGradient }}
      className="w-screen min-h-screen overflow-hidden flex justify-center items-center relative z-10"
    >
      <motion.div
        initial="hidden"
        animate={aboutControls}
        className="max-w-[1000px] px-4"
      >
        <motion.h1
          variants={fadeInUpVariants}
          custom={0}
          className={`khula-semibold text-6xl ${isMobile && "text-4xl"}`}
        >
          I believe in a user centered design approach, ensuring that every
          project I work on is tailored to meet the specific needs of its users.
        </motion.h1>

        <motion.div
          variants={fadeInUpVariants}
          custom={1}
          className={`mt-[10vh] ${isMobile && "mt-8"}`}
        >
          <p className="text-gray-3 poppins-light-italic ml-2 mb-1 select-none">
            This is me.
          </p>
          <motion.hr
            variants={lineVariants}
            className="bg-gray-3 origin-left w-full"
          ></motion.hr>
        </motion.div>
        <div
          className={`flex justify-between flex-row mt-16 ${isMobile && "mt-8 flex-col"}`}
        >
          <div className="flex flex-col w-1/2">
            <motion.h2
              variants={fadeInUpVariants}
              custom={2}
              className="khula-light text-5xl text-nowrap"
            >
              Hi, I'm Ben.
            </motion.h2>
            {!isMobile && (
              <Magnetic>
                <motion.button
                  variants={fadeInUpVariants}
                  custom={3}
                  onClick={() => lenis?.scrollTo("#contact")}
                  className="flex bg-dark rounded-full text-light pl-4 pr-6 gap-x-1 py-3 w-max poppins-regular mt-24 select-none"
                >
                  <ArrowUpRight />
                  Get in Touch
                </motion.button>
              </Magnetic>
            )}
          </div>
          <div
            className={`flex flex-col gap-y-4 w-1/2 khula-light text-2xl ${isMobile && "mt-8 text-lg w-full"}`}
          >
            <motion.p variants={fadeInUpVariants} custom={4}>
              I'm a 17 year-old passionate fullstack web developer dedicated to
              turning ideas into creative solutions. I specialize in creating
              seamless and intuitive user experiences.
            </motion.p>
            <motion.p variants={fadeInUpVariants} custom={5}>
              I'm involved in every step of the process: from discovery and
              design to development, testing, and deployment. I focus on
              delivering high-quality, scalable results that drive positive user
              experiences.
            </motion.p>
          </div>
          {isMobile && (
            <motion.button
              variants={fadeInUpVariants}
              custom={3}
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView()
              }
              className="flex bg-dark rounded-full text-light pl-4 pr-6 gap-x-1 py-3 w-max h-fit poppins-regular select-none mt-8"
            >
              <ArrowUpRight />
              Get in Touch
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
