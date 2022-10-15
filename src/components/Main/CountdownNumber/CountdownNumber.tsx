import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";

const CountDownContainer = styled(motion.span)`
  margin-left: 1.5vw;
`;

export const CountdownNumber: FC<{ remaining: number; unit: string }> = (
  props
) => {
  return (
    <>
      {" "}
      <CountDownContainer>
        <AnimatePresence>
          <motion.span
            key={props.remaining}
            exit={{ y: 50, opacity: 0, position: "absolute" }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.5,
            }}
          >
            {props.remaining}
          </motion.span>
        </AnimatePresence>
      </CountDownContainer>
      &nbsp;{props.unit}
      {props.remaining === 1 ? "" : "s"}
    </>
  );
};
