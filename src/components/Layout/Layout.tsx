import React, { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Normalize } from "styled-normalize";
import { useTheme } from "../../hooks/theme";
import { Header } from "../Header/Header";
import Head from "next/head";
import { Loading } from "./Loading/Loading";
import { initializeFirebase } from "../../misc/firebase";

const StyledMain = styled.main`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  text-rendering: optimizeLegibility;
`;

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  useEffect(() => {
    initializeFirebase();
  }, []);
  return theme ? (
    <React.StrictMode>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Normalize />
      <ThemeProvider theme={theme}>
        <StyledMain>
          <Header />
          {children}
        </StyledMain>
      </ThemeProvider>
    </React.StrictMode>
  ) : (
    <Loading />
  );
}
