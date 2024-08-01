import { Project } from ".";
import { motion } from "framer-motion";

export default function Overlay({ project }: { project: Project }) {
  return (
    <motion.div
      className="text-white pointer-events-auto h-screen max-h-screen flex max-w-[1000px] w-full flex-col justify-between items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="khula-regular text-8xl tracking-[calc(6rem * 0.03)] mb-[4vh] mt-[20vh]">
        {project.title}
      </h1>

      <p className="khula-light text-sm tracking-[calc(0.875rem * 0.05)] uppercase text-gray-1">
        Description
      </p>
      <hr className="w-[350px] border-gray-2 mt-2" />
      <p className="poppins-regular text-base text-gray-1 mt-8 mb-16 w-[800px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
        libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
        sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
      </p>
      <img
        className="w-full object-cover object-top h-[45vh] rounded-2xl rounded-b-none"
        style={{
          border: "1px solid rgb(" + project.color + ")",
          borderBottom: "none",
          boxShadow: "0px 0px 16px 8px rgba(" + project.color + ", 0.25)",
        }}
        src={project.image}
      />
    </motion.div>
  );
}
