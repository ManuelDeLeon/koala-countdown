import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import { sharedUser } from "../../misc/sharedState";
import { signOut } from "../../misc/firebase";
import Link from "next/link";

const StyledHeader = styled.header`
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 2vw;
  padding-right: 2vw;
  display: flex;
  position: relative;
  place-content: center;
`;

const StyledMain = styled.a`
  margin: auto;
  width: fit-content;
`;

const StyledArticle = styled.article`
  position: absolute;
  right: 2vw;
`;

const StyledLoginButton = css`
  position: absolute;
  right: 0;
  cursor: pointer;
  text-decoration-line: none;
  background-color: #ffe467;
  color: #062b38;
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
const StyledLoginLink = styled.a`
  ${StyledLoginButton}
`;
const StyledLogoutNav = styled.nav`
  ${StyledLoginButton}
`;

const StyledNav = styled.a`
  position: absolute;
  left: 2vw;
  font-size: 16px;
  color: #062b38;
  text-decoration-line: none;
  :hover {
    filter: brightness(85%);
  }
`;

export const Header = () => {
  const router = useRouter();
  const [user] = sharedUser();

  function logout() {
    signOut();
    router.push("/");
  }

  return (
    <StyledHeader>
      <StyledNav
        href="https://github.com/ManuelDeLeon/koala-countdown"
        target="_blank"
      >
        Source Code
      </StyledNav>
      <Link href="/" passHref>
        <StyledMain title="Koala Countdown">
          <svg
            width="181"
            height="24"
            viewBox="0 0 181 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M57.8195 0H46.2125C40.0623 0 37.2876 2.86732 37.2876 9.24868V14.7513C37.2876 21.1335 40.0164 24 46.1666 24H57.7736C63.9238 24 66.6526 21.1335 66.6526 14.7513V9.24868C66.6985 2.86732 63.9221 0 57.8195 0ZM46.4437 18.4047C44.0854 18.4047 43.3919 17.8039 43.3919 15.8178V8.23143C43.3919 6.19694 44.0854 5.64451 46.4437 5.64451H57.5424C59.9007 5.64451 60.5942 6.24534 60.5942 8.23143V15.8153C60.5942 17.8498 59.9007 18.4022 57.5424 18.4022L46.4437 18.4047ZM101.212 23.7687H108.241L94.1831 0.230957H88.9108L74.8997 23.8154H81.9286L84.4721 19.5144H98.7152L101.212 23.7687ZM87.755 13.9216L91.547 7.49605L95.3389 13.9216H87.755ZM180.25 23.7687H173.222L170.725 19.5144H156.482L153.938 23.8154H146.909L160.921 0.230957H166.193L180.25 23.7687ZM163.557 7.49605L159.765 13.9216H167.349L163.557 7.49605ZM123.055 0.230957H116.904V23.8154H138.684V18.1734H123.054L123.055 0.230957ZM6.10515 0.207031V9.50077L19.6373 0.207031H29.5535L14.7764 10.3645L29.4125 23.7906H20.9942L9.89207 13.72L6.10515 16.3227V23.7906H0V0.207031H6.10515Z"
              fill="#062B38"
            ></path>
          </svg>
        </StyledMain>
      </Link>

      {router.pathname !== "/login" ? (
        <StyledArticle>
          {user ? (
            <StyledLogoutNav onClick={logout}>Logout</StyledLogoutNav>
          ) : (
            <Link href="/login" passHref>
              <StyledLoginLink>Login</StyledLoginLink>
            </Link>
          )}
        </StyledArticle>
      ) : null}
    </StyledHeader>
  );
};
