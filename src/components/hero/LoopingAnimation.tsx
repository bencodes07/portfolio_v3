import { useReducer, useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";

type AnimationState = {
  leftKey: number;
  rightKey: number;
};

type Action = { type: "INCREMENT_LEFT" } | { type: "INCREMENT_RIGHT" };

const initialState: AnimationState = { leftKey: 0, rightKey: 1 };

function reducer(state: AnimationState, action: Action): AnimationState {
  switch (action.type) {
    case "INCREMENT_LEFT":
      return { ...state, leftKey: state.leftKey + 2 };
    case "INCREMENT_RIGHT":
      return { ...state, rightKey: state.rightKey + 2 };
  }
}

type AnimatedShapeProps = {
  side: "left" | "right";
  onComplete: () => void;
  width: number;
  height: number;
  isMobile: boolean;
};

function AnimatedShape({
  side,
  onComplete,
  width,
  height,
  isMobile,
}: AnimatedShapeProps) {
  const [scope, animate] = useAnimate();
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const runAnimation = async () => {
      // Draw the outline
      await animate(scope.current, { pathLength: 1 }, { duration: 1.5 });
      // Fill the shape
      await animate(scope.current, { fillOpacity: 1 }, { duration: 0.5 });
      // Move the shape down
      await animate(scope.current, { y: "50%" }, { duration: 1 });
      onComplete();
    };

    animationRef.current = requestAnimationFrame(runAnimation);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, onComplete]);

  const centerX = width / 2;
  const yStart = (height * 2) / 3;
  const xOffset = isMobile ? width * 0.3 : width * 0.12;

  const path = `M ${centerX + (side === "left" ? -xOffset : xOffset)} ${yStart} 
                L ${centerX} ${yStart + 100} 
                L ${centerX} ${yStart + 132} 
                L ${centerX + (side === "left" ? -xOffset : xOffset)} ${
                  yStart + 32
                } Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="fixed top-0 left-0 "
    >
      <motion.path
        ref={scope}
        d={path}
        stroke="var(--svg-line)"
        strokeWidth="2"
        fill="var(--svg-line)"
        initial={{ pathLength: 0, fillOpacity: 0, y: 0 }}
      />
    </svg>
  );
}

interface LoopingAnimationProps {
  width: number;
  height: number;
  isMobile: boolean;
}

function LoopingAnimation({ width, height, isMobile }: LoopingAnimationProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <AnimatedShape
        key={`left-${state.leftKey}`}
        side="left"
        onComplete={() => dispatch({ type: "INCREMENT_LEFT" })}
        width={width}
        height={height}
        isMobile={isMobile}
      />
      <AnimatedShape
        key={`right-${state.rightKey}`}
        side="right"
        onComplete={() => dispatch({ type: "INCREMENT_RIGHT" })}
        width={width}
        height={height}
        isMobile={isMobile}
      />
    </>
  );
}

export default LoopingAnimation;
