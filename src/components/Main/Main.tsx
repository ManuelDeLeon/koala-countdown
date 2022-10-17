import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { CountdownNumber } from "./CountdownNumber/CountdownNumber";
import { Countdown } from "../../models/Countdown";
import { Loading } from "../Layout/Loading/Loading";
import { sharedUser } from "../../misc/sharedState";
import Link from "next/link";
import Confetti from "react-confetti";

const StyledMain = styled.header`
  padding: 30px;
  background: ${(props) => props.theme.global.body_color};
  text-align: center;
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
  font-size: 4vw;
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

const StyledUpdateLink = styled.a`
  margin-top: 60px;
  cursor: pointer;
  text-decoration-line: none;
  background-color: ${(props) => props.theme.global.success_color};
  color: ${(props) => props.theme.global.body_color};
  padding: 8px 16px;
  font-style: normal;
  font-weight: bold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 12px;
  :hover {
    filter: brightness(95%);
  }
`;

const StyledUpdateWrap = styled.div`
  margin-top: 100px;
`;

export const Main = () => {
  const [user] = sharedUser();
  const [deadline, setDeadline] = useState<dayjs.Dayjs>(dayjs());
  const [targetDateReady, setTargetDateReady] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    let interval: any;
    Countdown.get().then((val) => {
      const targetDate = dayjs(val?.deadline.toDate());
      setDeadline(targetDate);
      setTargetDateReady(true);
      function updateDates() {
        const currentDate = dayjs();
        setDaysRemaining(targetDate.diff(currentDate, "days"));
        setHoursRemaining(targetDate.diff(currentDate, "hours") % 24);
        setMinutesRemaining(targetDate.diff(currentDate, "minutes") % 60);
        setSecondsRemaining(targetDate.diff(currentDate, "seconds") % 60);
      }
      updateDates();
      interval = setInterval(() => {
        updateDates();
      }, 500);
    });

    return () => clearInterval(interval);
  }, []);

  function itHappened() {
    return dayjs().isAfter(deadline);
  }

  return (
    <StyledMain>
      {targetDateReady && !itHappened() ? (
        <>
          <StyledHeader>Our product will launch in</StyledHeader>
          <StyledRemaining title="Time Remaining">
            {daysRemaining > 0 ? (
              <CountdownNumber
                unit="day"
                remaining={daysRemaining}
              ></CountdownNumber>
            ) : null}

            {daysRemaining > 0 || hoursRemaining > 0 ? (
              <CountdownNumber
                unit="hour"
                remaining={hoursRemaining}
              ></CountdownNumber>
            ) : null}

            {daysRemaining > 0 || hoursRemaining > 0 || minutesRemaining > 0 ? (
              <CountdownNumber
                unit="minute"
                remaining={minutesRemaining}
              ></CountdownNumber>
            ) : null}

            <CountdownNumber
              unit="second"
              remaining={secondsRemaining}
            ></CountdownNumber>
          </StyledRemaining>
        </>
      ) : targetDateReady && itHappened() ? (
        <>
          <StyledHeader>Our product launched!</StyledHeader>
          <Confetti />
        </>
      ) : (
        <Loading></Loading>
      )}
      {user && targetDateReady ? (
        <StyledUpdateWrap>
          <Link href="/updateCountdown" passHref>
            <StyledUpdateLink>Update Countdown</StyledUpdateLink>
          </Link>
        </StyledUpdateWrap>
      ) : (
        <StyledInfo>Login to update the countdown.</StyledInfo>
      )}
    </StyledMain>
  );
};
