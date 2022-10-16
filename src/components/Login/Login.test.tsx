import { render } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import { Login } from "./Login";

test("Can render Login", () => {
  render(
    <ThemeProvider theme={{ global: {} }}>
      <Login />
    </ThemeProvider>
  );
  expect(true).toBe(true);
});
