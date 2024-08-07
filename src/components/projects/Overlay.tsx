import { ArrowUpRight } from "lucide-react";
import { Project } from ".";
import { motion } from "framer-motion";
import Magnetic from "../Magnetic";

export default function Overlay({
  project,
  isMobile,
}: {
  project: Project;
  isMobile: boolean;
}) {
  return (
    <motion.div
      data-lenis-prevent
      className="text-white inset-0 overflow-y-scroll overflow-x-hidden fixed max-h-[100vh] px-4 w-full flex justify-center pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div
        style={{ marginTop: !isMobile ? "20vh" : "2.5rem" }}
        className="max-w-[1000px] w-full"
      >
        <div
          className={`flex flex-row items-center ${!isMobile ? "justify-between" : "justify-start gap-x-2"} w-full mb-[4vh] pr-12`}
        >
          <h1 className="khula-regular max-sm:text-[12vw] text-8xl tracking-[calc(6rem * 0.03)]">
            {project.title}
          </h1>
          <Magnetic>
            <a
              href={project.link}
              target="_blank"
              className="cursor-pointer hover:bg-light hover:text-dark rounded-full size-12 transition-colors ease-in duration-300"
              title={project.title.includes("Portfolio") ? "Figma Design" : ""}
            >
              <ArrowUpRight size={48} className="mb-2" />
            </a>
          </Magnetic>
        </div>

        <div className="flex flex-col">
          <div
            className="flex flex-row gap-x-12"
            style={{ flexDirection: isMobile ? "column" : "row" }}
          >
            <div>
              <p className="khula-light text-sm tracking-[calc(0.875rem * 0.05)] uppercase text-gray-1">
                Description
              </p>
              <hr className="w-[350px] border-gray-2 mt-2" />
              <p className="poppins-regular text-base text-gray-1 overflow-y-auto overflow-x-hidden mt-8 mb-[4vh] max-w-[500px] w-full">
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
                  {project.technologies.backend.includes("Not Involved") ? (
                    <i>Not Involved</i>
                  ) : (
                    project.technologies.backend
                  )}
                </p>
              </p>
            </div>
          </div>
          <img
            className={`w-full object-cover object-top rounded-2xl select-none ${!project.title.includes("TCG") && "mb-12"}`}
            style={{
              border: "1px solid rgb(" + project.color + ")",
              boxShadow: "0px 0px 16px 8px rgba(" + project.color + ", 0.25)",
            }}
            src={project.imageDetail}
          />
          {project.title.includes("TCG") && (
            <p className="my-8 poppins-regular-italic text-base text-gray-2 w-full text-center">
              Disclaimer: This project was developed during my employment at
              TCG-Vault, where I contributed as part of the development team.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
