import LocomotiveScroll from "locomotive-scroll";
import React from "react";

const ScrollContext = React.createContext<LocomotiveScroll | null>(null);

export const ScrollProvider = ScrollContext.Provider;
export const useScroll = () => React.useContext(ScrollContext);
