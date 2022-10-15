// F3FCFF

import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { signIn } from "../../misc/firebase";
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

const StyledLinks = styled.a`
  color: ${(props) => props.theme.global.primary_active_color};
  font-size: 0.8em;
  position: absolute;
`;

const StyledLoginError = styled.p`
  color: ${(props) => props.theme.global.error_color};
`;

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [forceEmailError, setForceEmailError] = useState(false);
  const [forcePasswordError, setForcePasswordError] = useState(false);
  const emailError = forceEmailError || (!!email && !isValidEmail(email));
  const passwordError =
    forcePasswordError || (!!password && password.length < 10);

  const router = useRouter();
  function login() {
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

    signIn(email, password)
      .then(() => {
        router.push("/");
      })
      .catch((error: any) => {
        if (error.code === "auth/wrong-password") {
          setLoginError("Wrong password.");
        } else if (error.code === "auth/user-not-found") {
          setLoginError("Email not found.");
        } else {
          setLoginError(error.code);
        }
      });
  }
  const theme = useContext(ThemeContext);

  function updateEmail(e: ChangeEvent<HTMLInputElement>) {
    setForceEmailError(false);
    setEmail(e.target.value);
    setLoginError("");
  }

  function updatePassword(e: ChangeEvent<HTMLInputElement>) {
    setForcePasswordError(false);
    setPassword(e.target.value);
    setLoginError("");
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
          <Link href="/forgotPassword" passHref>
            <StyledLinks style={{ left: 0 }}>Forgot password?</StyledLinks>
          </Link>
          <StyledLoginButton onClick={login}>Login</StyledLoginButton>

          <Link href="/createAccount" passHref>
            <StyledLinks style={{ right: 0 }}>Create account</StyledLinks>
          </Link>
        </StyledControl>
        {loginError ? <StyledLoginError>{loginError}</StyledLoginError> : null}
      </StyledForm>
    </StyledMain>
  );
};
