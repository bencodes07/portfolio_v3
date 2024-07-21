import { useEffect, useState } from "react";
import "./assets/globals.scss";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: any) => {
    const delay = 1 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 2.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

function App() {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      new LocomotiveScroll();
    })();

    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    console.log(width);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      });
    };
  }, []);
  return (
    <>
      <div className="w-screen h-screen bg-landing-bg-image backdrop-blur-3xl">
        <div className="absolute top-0 flex w-full h-full flex-col justify-center items-center z-[1]">
          <motion.svg
            width={width}
            height={height}
            initial="hidden"
            animate="visible"
          >
            <motion.line
              x1={width / 2}
              y1={height}
              x2={width / 2}
              y2={0}
              stroke={"#222222"}
              variants={draw}
            ></motion.line>

            <motion.line
              x1={width / 2 - width * 0.12}
              y1={0}
              x2={width / 2 - width * 0.12}
              y2={height}
              stroke={"#222222"}
              variants={draw}
            ></motion.line>
            <motion.line
              x1={width / 2 + width * 0.12}
              y1={0}
              x2={width / 2 + width * 0.12}
              y2={height}
              stroke={"#222222"}
              variants={draw}
            ></motion.line>

            <motion.line
              x1={width / 2 - width * 0.12 - 30}
              y1={0}
              x2={width / 2 - width * 0.12 - 30}
              y2={height}
              stroke={"#222222"}
              variants={draw}
            ></motion.line>
            <motion.line
              x1={width / 2 + width * 0.12 + 30}
              y1={0}
              x2={width / 2 + width * 0.12 + 30}
              y2={height}
              stroke={"#222222"}
              variants={draw}
            ></motion.line>

            <motion.line
              x1={width / 2 - width * 0.12 - 30 - width * 0.125}
              y1={height}
              x2={width / 2 - width * 0.12 - 30 - width * 0.125}
              y2={0}
              stroke={"#222222"}
              variants={draw}
            ></motion.line>
            <motion.line
              x1={width / 2 + width * 0.12 + 30 + width * 0.125}
              y1={height}
              x2={width / 2 + width * 0.12 + 30 + width * 0.125}
              y2={0}
              stroke={"#222222"}
              variants={draw}
            ></motion.line>
          </motion.svg>
        </div>
        <div className="flex justify-center items-center relative z-10">
          <Navbar />
          <div className="h-screen flex flex-col justify-center items-center">
            <h1
              className="text-[80px] text-light khula-extrabold w-[732px] text-center leading-[85px]"
              style={{ textShadow: "0px 0px 6px rgba(255,255,255,0.25)" }}
            >
              Turning ideas into{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #FE7171 0%, #EC5500 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                creative
              </span>{" "}
              solutions.
            </h1>
            <p className="poppins-regular text-gray-1 w-[420px] text-center text-xl mt-4 shadow-none">
              Innovative web developer crafting unique user experiences.
            </p>
          </div>
        </div>
      </div>

      <div className="w-screen h-screen">Test</div>
    </>
  );
}

export default App;
