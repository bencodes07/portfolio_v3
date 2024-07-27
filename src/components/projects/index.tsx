import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MotionValue,
  motion,
  AnimatePresence,
  useSpring,
  useAnimationControls,
} from "framer-motion";

type ProjectsSectionProps = {
  isProjectsInView: boolean;
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

const Projects: React.FC<ProjectsSectionProps> = ({
  isProjectsInView,
  isMobile,
  backgroundGradient,
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isScrolling, setIsScrolling] = useState(false);

  const projectsControls = useAnimationControls();
  const [hasAnimated, setHasAnimated] = useState(false);

  const cursorX = useSpring(0, { stiffness: 200, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 200, damping: 50 });

  useEffect(() => {
    if (isProjectsInView && !hasAnimated) {
      projectsControls.start("visible");
      setHasAnimated(true);
    } else if (!isProjectsInView && hasAnimated) {
      projectsControls.start("hidden");
      setHasAnimated(false);
    }
  }, [isProjectsInView, projectsControls, hasAnimated, setHasAnimated]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 100); // Debounce scrolling state
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const items = itemsRef.current;
    if (!items) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    const checkHover = () => {
      if (isScrolling) {
        const hoverItem = document.elementFromPoint(
          cursorX.get(),
          cursorY.get()
        );
        const projectItem = hoverItem?.closest(".project-item");
        if (projectItem) {
          const index = Array.from(items.children).indexOf(
            projectItem as Element
          );
          setActiveIndex(index);
        } else {
          setActiveIndex(-1);
        }
      }
    };

    items.addEventListener("mouseleave", () => {
      setActiveIndex(-1);
    });

    const scrollCheckInterval = setInterval(checkHover, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(scrollCheckInterval);
    };
  }, [isMobile, handleMouseMove, handleScroll, cursorX, cursorY, isScrolling]);

  const projects = [
    {
      number: "01",
      title: "MeetMate",
      category: "Web Development / Design",
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      number: "02",
      title: "fishtrack.",
      category: "iOS Development / Product Design",
      image: "https://picsum.photos/400/300?random=2",
    },
    {
      number: "03",
      title: "EssentialsB",
      category: "Web Development",
      image: "https://picsum.photos/400/300?random=3",
    },
    {
      number: "04",
      title: "Portfolio",
      category: "Java Development",
      image: "https://picsum.photos/400/300?random=4",
    },
  ];

  return (
    <motion.div
      style={{ background: backgroundGradient }}
      className="w-screen min-h-screen overflow-hidden flex justify-center flex-col items-center relative z-10"
    >
      <motion.div
        initial="hidden"
        animate={projectsControls}
        className="max-w-[1000px] w-full flex justify-center flex-col items-center"
      >
        <motion.h2
          custom={0}
          variants={fadeInUpVariants}
          className="poppins-light text-3xl tracking-[calc(3rem * 0.02)] mb-10"
        >
          Selected Projects
        </motion.h2>

        <AnimatePresence>
          {activeIndex !== -1 && (
            <motion.div
              ref={galleryRef}
              className="fixed w-[385px] h-[200px] overflow-hidden pointer-events-none z-50 rounded-xl"
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              style={{
                left: cursorX,
                top: cursorY,
                x: "-50%",
                y: "-50%",
              }}
            >
              <motion.div
                ref={imagesRef}
                className="w-full h-[800px] flex flex-col"
                animate={{ y: `-${200 * activeIndex}px` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {projects.map((project) => (
                  <div
                    key={project.number}
                    className="w-full h-[200px] bg-cover bg-center"
                    style={{ backgroundImage: `url('${project.image}')` }}
                  ></div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={itemsRef}
          className="flex justify-center items-center flex-col w-full"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.number}
              className="flex flex-col w-full group project-item cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              variants={fadeInUpVariants}
              custom={index + 1}
            >
              <div className="w-full flex justify-between items-center h-[200px]">
                <div className="flex justify-start items-start h-fit gap-x-4">
                  <p className="poppins-extralight text-2xl leading-none group-hover:text-gray-2 text-gray-3 transition-colors">
                    {project.number}
                  </p>
                  <h1 className="khula-regular text-6xl tracking-[calc(3.75rem * 0.03)] group-hover:text-gray-2 transition-all group-hover:ml-2">
                    {project.title}
                  </h1>
                </div>
                <p className="poppins-extralight text-lg pr-2 group-hover:text-gray-2 group-hover:pr-4 transition-all">
                  {project.category}
                </p>
              </div>
              <hr className="w-full border-gray-1 group-hover:border-gray-4 transition-colors"></hr>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Projects;
