import React from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { X } from "lucide-react";
import { useScroll as useContextScroll } from "../contexts/ScrollContext";

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose }) => {
  const { scrollY } = useScroll();

  const locomotiveScroll = useContextScroll();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    if (locomotiveScroll) {
      const target = document.getElementById(targetId);
      if (target) {
        locomotiveScroll.scrollTo(target);
      }
    }
    onClose();
  };
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute top-0 right-0 w-1/3 max-2xl:w-1/2 max-xl:w-2/3 max-md:w-full h-full bg-white z-[100] flex flex-col p-6 overflow-y-auto max-w-screen-md"
        initial="initial"
        animate={"animate"}
        exit="exit"
        variants={{
          initial: { scaleX: "0%" },
          animate: {
            scaleX: isOpen ? "100%" : "0%",
            transition: {
              duration: 0.6,
              ease: [0.79, 0.35, 0.26, 1],
            },
          },
        }}
        style={{ originX: 1, top: scrollY }} // This ensures the scale animation starts from the right
      ></motion.div>

      {/* Navigation Menu */}
      <motion.div
        className="fixed right-0 h-screen w-1/3 max-2xl:w-1/2 max-xl:w-2/3 max-md:w-full z-[100] flex flex-col p-6 justify-center max-w-screen-md bg-white overflow-y-auto"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { x: "100%", opacity: 0 },
          animate: {
            x: isOpen ? "0%" : "100%",
            opacity: isOpen ? 1 : 0,
            transition: {
              duration: 0.5,
              ease: [0.79, 0.35, 0.26, 1],
            },
          },
          exit: {
            x: "100%",
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: [0.79, 0.35, 0.26, 1],
            },
          },
        }}
        style={{ top: scrollY + "px" }} // Set the top position based on scrollY
      >
        <motion.div
          className="flex justify-end items-center"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <button
            className="fixed top-6 right-6 z-40 px-4 py-2 text-dark text-xl poppins-regular flex flex-row gap-x-2 items-center pl-20"
            onClick={onClose}
          >
            <X size={32} />
          </button>
        </motion.div>

        <div className="flex justify-between flex-grow mt-12 mx-[15%] max-sm:mx-[5%] items-center">
          <div className="flex flex-grow flex-row max-sm:flex-col-reverse items-start justify-between w-full">
            <motion.div
              className="space-y-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h3 className="text-lg khula-light max-sm:mt-10">Social</h3>
              <ul className="space-y-2">
                {["LinkedIn", "Instagram", "GitHub"].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  >
                    <a
                      href="#"
                      className="hover:underline text-xl poppins-light"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h3 className="text-lg khula-light">Menu</h3>
              <ul className="space-y-2">
                {[
                  { name: "About Me", id: "about" },
                  { name: "Projects", id: "projects" },
                  { name: "Experience", id: "about" },
                  { name: "Contact", id: "contact" },
                ].map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`text-[2.5rem] ${
                        !(window.innerWidth <= 768) && "hover:left-2"
                      } left-0 relative transition-[left] duration-300 ease-in-out`}
                    >
                      {item.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mx-[15%] max-sm:mx-[5%] mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <p className="text-sm text-gray-600">Get in touch</p>
          <a
            href="mailto:boeckmannben@gmail.com"
            className="text-lg hover:underline"
          >
            boeckmannben@gmail.com
          </a>
        </motion.div>
      </motion.div>
    </>
  );
};

export default NavMenu;
