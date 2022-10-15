import styled, { keyframes } from "styled-components";

const keyFramesMain = keyframes`
    0% {
        transform: scale(0.95);
    }

    70% {
        transform: scale(1);
    }

    100% {
        transform: scale(0.95);
    }
`;

const StyledMain = styled.main`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 25vh;
  width: fit-content;
  transform: scale(1);
  animation-name: ${keyFramesMain};
  animation-duration: 1s;
  animation-iteration-count: infinite;
`;

export function Loading() {
  return (
    <StyledMain>
      <img src="/Logo.png" alt="Loading..." />
    </StyledMain>
  );
}
