import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledMain = styled.header`
  padding: 30px;
  background: ${(props) => props.theme.global.body_color};
`;

const StyledHeader = styled.h1`
  text-align: center;
  font-size: 6vw;
  line-height: 1.1;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 24px;
`;

const StyledRemaining = styled(StyledHeader)`
  font-size: 4.5vw;
`;

const StyledInfo = styled.p`
  text-align: center;
  font-family: "Orbikular", serif;
  font-size: 1.3333em;
  line-height: 1.2;
  font-style: normal;
  font-weight: 300;
  letter-spacing: -0.01em;
  margin-top: 100px;
`;

const StyledTimeBlock = styled.span`
  margin: 1.5vw;
`;

export const Main = () => {
  const launchDate = dayjs().add(0, "days").add(3, "hours").add(5, "seconds");
  const currentDate = dayjs();
  const [daysRemaining, setDaysRemaining] = useState(
    launchDate.diff(currentDate, "days")
  );
  const [hoursRemaining, setHoursRemaining] = useState(
    launchDate.diff(currentDate, "hours") % 24
  );
  const [minutesRemaining, setMinutesRemaining] = useState(
    launchDate.diff(currentDate, "minutes") % 60
  );
  const [secondsRemaining, setSecondsRemaining] = useState(
    launchDate.diff(currentDate, "seconds") % 60
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = dayjs();
      setDaysRemaining(launchDate.diff(currentDate, "days"));
      setHoursRemaining(launchDate.diff(currentDate, "hours") % 24);
      setMinutesRemaining(launchDate.diff(currentDate, "minutes") % 60);
      setSecondsRemaining(launchDate.diff(currentDate, "seconds") % 60);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledMain>
      <StyledHeader>Our product will launch in</StyledHeader>
      <StyledRemaining>
        <StyledTimeBlock>
          {daysRemaining} day{daysRemaining === 1 ? "" : "s"}
        </StyledTimeBlock>
        <StyledTimeBlock>
          {hoursRemaining} hour{hoursRemaining === 1 ? "" : "s"}
        </StyledTimeBlock>
        <StyledTimeBlock>
          {minutesRemaining} minute{minutesRemaining === 1 ? "" : "s"}
        </StyledTimeBlock>
        <StyledTimeBlock>
          {secondsRemaining} second{secondsRemaining === 1 ? "" : "s"}
        </StyledTimeBlock>
      </StyledRemaining>
      <StyledInfo>More info on how to update the countdown.</StyledInfo>
    </StyledMain>
  );
};
