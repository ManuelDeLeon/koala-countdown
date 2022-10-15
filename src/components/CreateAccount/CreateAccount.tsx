// F3FCFF

import { ChangeEvent, useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { createAccount } from "../../misc/firebase";
import { isValidEmail } from "../../misc/functions";
import { useRouter } from "next/router";

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

const StyledCreateError = styled.p`
  color: ${(props) => props.theme.global.error_color};
`;

export const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forceEmailError, setForceEmailError] = useState(false);
  const [forcePasswordError, setForcePasswordError] = useState(false);
  const [createError, setCreateError] = useState("");
  const emailError = forceEmailError || (!!email && !isValidEmail(email));
  const passwordError =
    forcePasswordError || (!!password && password.length < 10);

  const router = useRouter();
  const create = () => {
    let failed = false;
    if (!email || !isValidEmail(email)) {
      setForceEmailError(true);
      failed = true;
    }
    if (!password || password.length < 10) {
      setForcePasswordError(true);
      failed = true;
    }
    if (failed) return;

    createAccount(email, password)
      .then(() => {
        router.push("/");
      })
      .catch((error: any) => {
        if (error.code === "auth/email-already-in-use") {
          setCreateError(`We already have an account with that email.`);
        } else {
          setCreateError(error.code);
        }
      });
  };

  const theme = useContext(ThemeContext);

  function updateEmail(e: ChangeEvent<HTMLInputElement>) {
    setForceEmailError(false);
    setEmail(e.target.value);
  }

  function updatePassword(e: ChangeEvent<HTMLInputElement>) {
    setForcePasswordError(false);
    setPassword(e.target.value);
  }

  return (
    <StyledMain>
      <StyledForm>
        <StyledControl>
          <StyledInput
            placeholder="Email Address"
            type="email"
            autoComplete="username"
            value={email}
            onChange={updateEmail}
            style={{
              borderColor: emailError
                ? theme.global.error_color
                : theme.global.success_color,
            }}
          />
          {emailError ? (
            <StyledError>Please enter your email</StyledError>
          ) : null}
        </StyledControl>
        <StyledControl>
          <StyledInput
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={updatePassword}
            style={{
              borderColor: passwordError
                ? theme.global.error_color
                : theme.global.success_color,
            }}
          />
          {passwordError ? (
            <StyledError>
              Password must be at least 10 characters long
            </StyledError>
          ) : null}
        </StyledControl>

        <StyledControl>
          <StyledLoginButton onClick={create}>Create Account</StyledLoginButton>
        </StyledControl>

        {createError ? (
          <StyledCreateError>{createError}</StyledCreateError>
        ) : null}
      </StyledForm>
    </StyledMain>
  );
};
