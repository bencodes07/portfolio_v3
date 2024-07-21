import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose }) => {
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
        className="absolute top-0 right-0 w-1/3 max-2xl:w-1/2 max-xl:w-2/3 max-md:w-full h-full bg-white z-50 flex flex-col p-6 overflow-y-auto max-w-screen-md"
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
        style={{ originX: 1 }} // This ensures the scale animation starts from the right
      ></motion.div>

      {/* Navigation Menu */}
      <motion.div
        className="fixed top-0 right-0 h-full w-1/3 max-2xl:w-1/2 max-xl:w-2/3 max-md:w-full z-50 flex flex-col p-6 justify-center max-w-screen-md"
        initial="initial"
        animate={"animate"}
        exit="exit"
        variants={{
          initial: { x: "40%", opacity: 0, display: "none" },
          animate: {
            x: isOpen ? "0%" : "40%",
            opacity: isOpen ? 1 : 0,
            display: isOpen ? "flex" : "none",
            transition: {
              duration: 0.5,
              delay: !isOpen ? 0 : 0.2,
            },
          },
        }}
        style={{ originX: 1 }} // This ensures the scale animation starts from the right
      >
        <motion.div
          className="flex justify-end items-center"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </motion.div>

        <div className="flex justify-between flex-grow mt-12 mx-[15%] items-center">
          <div className="flex flex-grow items-start justify-between w-full">
            <motion.div
              className="space-y-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h3 className="text-lg khula-light">Social</h3>
              <ul className="space-y-2">
                {["LinkedIn", "Instagram", "GitHub"].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  >
                    <a href="#" className="hover:underline text-xl">
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
                {["About Me", "Projects", "Experience", "Contact"].map(
                  (item, index) => (
                    <motion.li
                      key={item}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                    >
                      <a href="#" className="text-[2.5rem]">
                        {item}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mx-12 mb-12"
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
