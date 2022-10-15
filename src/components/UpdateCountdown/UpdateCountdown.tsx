import styled from "styled-components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import { Countdown } from "../../models/Countdown";
import { useRouter } from "next/router";
import { Loading } from "../Layout/Loading/Loading";

const StyledMain = styled.main`
  background-color: #f3fcff;
  padding: 60px;
`;

const StyledForm = styled.form`
  text-align: center;
  max-width: 500px;
  min-width: 260px;
  margin: auto;
`;

const StyledControl = styled.div`
  position: relative;
  margin-bottom: 60px;
  max-width: 500px;
`;

const StyledButton = styled.a`
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

const StyledError = styled.p`
  color: ${(props) => props.theme.global.error_color};
`;

export const UpdateCountdown = () => {
  const [targetDate, setTargetDate] = useState<
    dayjs.Dayjs | null | undefined
  >();
  const [updateError, setUpdateError] = useState("");
  const [targetDateReady, setTargetDateReady] = useState(false);
  const router = useRouter();

  function update() {
    if (!targetDate) return;
    const deadline = Timestamp.fromDate(targetDate.toDate());

    Countdown.update(deadline)
      .then(() => {
        router.push("/");
      })
      .catch((error: any) => {
        setUpdateError(error.code);
      });
  }

  useEffect(() => {
    Countdown.get().then((val) => {
      const targetDate = dayjs(val?.deadline.toDate());
      setTargetDate(targetDate);
      setTargetDateReady(true);
    });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledMain>
        {targetDateReady ? (
          <>
            <StyledForm>
              <StyledControl>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Launch Date"
                  value={targetDate}
                  onChange={(newValue) => {
                    setTargetDate(newValue);
                  }}
                />
              </StyledControl>
              <StyledControl>
                <StyledButton onClick={update}>Update Launch Date</StyledButton>
              </StyledControl>
              {updateError ? <StyledError>{updateError}</StyledError> : null}
            </StyledForm>
          </>
        ) : (
          <Loading></Loading>
        )}
      </StyledMain>
    </LocalizationProvider>
  );
};
