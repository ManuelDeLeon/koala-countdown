// F3FCFF

import { useState } from "react";
import styled from "styled-components";
import { isValidEmail } from "../../misc/functions";

const StyledMain = styled.main`
  background-color: #f3fcff;
  padding: 30px;
`;

const StyledForm = styled.form`
  text-align: center;
  max-width: 500px;
  min-width: 260px;
  margin: auto;
`;

const StyledControl = styled.div`
  position: relative;
  margin-bottom: 30px;
  max-width: 500px;
`;
const StyledInput = styled.input`
  position: relative;
  outline: none;
  border-radius: 7px;
  font-style: normal;
  font-size: 0.8em;
  font-weight: 400;
  padding: 14px 20px;
  line-height: 1.5;
  letter-spacing: -0.01em;
  width: -webkit-fill-available;
  border: 1px solid ${(props) => props.theme.global.success_color};
`;

const StyledError = styled.p`
  letter-spacing: 0.08em;
  font-size: 0.7em;
  position: absolute;
  right: 2vw;
  top: 0;
  color: ${(props) => props.theme.global.error_color};
`;

const StyledLoginButton = styled.a`
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

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const emailError = !!email && !isValidEmail(email);
  return (
    <StyledMain>
      <StyledForm>
        <StyledControl>
          <StyledInput
            placeholder="Email Address"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError ? (
            <StyledError>Please enter your email</StyledError>
          ) : null}
        </StyledControl>
        <StyledControl>
          <StyledLoginButton>Reset Password</StyledLoginButton>
        </StyledControl>
      </StyledForm>
    </StyledMain>
  );
};
