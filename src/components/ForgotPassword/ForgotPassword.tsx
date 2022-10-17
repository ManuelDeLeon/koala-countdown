// F3FCFF

import { useRouter } from "next/router";
import { ChangeEvent, useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { resetPassword } from "../../misc/firebase";
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

const StyledCreateError = styled.p`
  color: ${(props) => props.theme.global.error_color};
`;

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forceEmailError, setForceEmailError] = useState(false);
  const [resetError, setResetError] = useState("");
  const emailError = forceEmailError || (!!email && !isValidEmail(email));

  const theme = useContext(ThemeContext);

  function updateEmail(e: ChangeEvent<HTMLInputElement>) {
    setForceEmailError(false);
    setEmail(e.target.value);
    setResetError("");
  }

  const router = useRouter();
  const reset = () => {
    if (!email || !isValidEmail(email)) {
      setForceEmailError(true);
      return;
    }

    resetPassword(email)
      .then(() => {
        setResetError(
          "We just sent you an email to reset your password. (check Spam folder too)"
        );
        setTimeout(() => {
          router.push("/login");
        }, 20000);
      })
      .catch((error: any) => {
        if (error.code === "auth/user-not-found") {
          setResetError("Email not found.");
        } else {
          setResetError(error.code);
        }
      });
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      reset();
    }
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
            onKeyDown={handleKeyDown}
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
          <StyledLoginButton onClick={reset}>Reset Password</StyledLoginButton>
        </StyledControl>

        {resetError ? (
          <StyledCreateError>{resetError}</StyledCreateError>
        ) : null}
      </StyledForm>
    </StyledMain>
  );
};
