import { Project } from ".";
import { motion } from "framer-motion";

export default function Overlay({
  project,
  isMobile,
}: {
  project: Project;
  isMobile: boolean;
}) {
  return (
    <motion.div
      className="text-white px-4 pointer-events-auto h-screen max-h-screen flex max-w-[1000px] w-full flex-col justify-between items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <h1
        className="khula-regular max-sm:text-[12vw] text-8xl tracking-[calc(6rem * 0.03)] mb-[4vh]"
        style={{ marginTop: !isMobile ? "20vh" : "2rem" }}
      >
        {project.title}
      </h1>

      <div
        className="flex gap-x-12"
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        <div>
          <p className="khula-light text-sm tracking-[calc(0.875rem * 0.05)] uppercase text-gray-1">
            Description
          </p>
          <hr className="w-[350px] border-gray-2 mt-2" />
          <p className="poppins-regular text-base text-gray-1 overflow-scroll mt-8 mb-[4vh] max-w-[500px] w-full">
            {project.description}
          </p>
        </div>
        <div>
          <p className="khula-light text-sm tracking-[calc(0.875rem * 0.05)] uppercase text-gray-1">
            Technologies
          </p>
          <hr className="w-[350px] border-gray-2 mt-2" />
          <p className="poppins-regular text-base text-gray-1 mt-8 mb-[4vh] max-w-[500px] w-full flex-col flex">
            <p className="flex gap-x-1 poppins-regular text-base text-gray-1">
              <span className="khula-light mt-[3px]">Frontend: </span>
              {project.technologies.frontend}
            </p>
            <p className="flex gap-x-1 poppins-regular text-base text-gray-1">
              <span className="khula-light mt-[3px]">Backend: </span>
              {project.technologies.backend}
            </p>
          </p>
        </div>
      </div>

      <img
        className="w-full object-cover object-top h-[45vh] rounded-2xl rounded-b-none select-none"
        style={{
          border: "1px solid rgb(" + project.color + ")",
          borderBottom: "none",
          boxShadow: "0px 0px 16px 8px rgba(" + project.color + ", 0.25)",
        }}
        src={project.imageDetail}
      />
    </motion.div>
  );
}
