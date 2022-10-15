import styled from "styled-components";
import { sharedCount } from "../../misc/sharedState";

const StyledMain = styled.header`
  height: 10rem;
  background: ${(props) => props.theme.global.body_color};
`;
export const Main = () => {
  const [count, setCount] = sharedCount();
  return (
    <StyledMain>
      <button onClick={() => setCount(count + 1)}>
        <>In Main {count}</>
      </button>
    </StyledMain>
  );
};
