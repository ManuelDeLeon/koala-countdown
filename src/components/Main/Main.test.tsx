import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import { useRouter } from "next/router";
import { Countdown } from "../../models/Countdown";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { Main } from "./Main";
import "jest-canvas-mock";

let timestampValue = "";
jest.mock("firebase/firestore", () => ({
  Timestamp: {
    fromDate: () => timestampValue,
  },
}));

let countdownGetReturn: Promise<{ deadline: { toDate: () => string } }> =
  new Promise((r) => r({ deadline: { toDate: () => "12/12/2012 11:34 AM" } }));

jest.mock("../../models/Countdown", () => ({
  Countdown: {
    get: () => countdownGetReturn,
  },
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const routerPush = jest.fn();
(useRouter as jest.Mock<any, any>).mockImplementation(() => ({
  push: routerPush,
}));

describe("UpdateCountdown", () => {
  describe("Target date in the past", () => {
    beforeEach(async () => {
      var date = new Date();
      date.setDate(date.getDate() - 5);
      countdownGetReturn = new Promise((r) =>
        r({ deadline: { toDate: () => date.toISOString() } })
      );
      await act(async () => {
        render(
          <ThemeProvider theme={{ global: {} }}>
            <Main />
          </ThemeProvider>
        );
      });
    });

    test("Shows launched message", () => {
      const msg = screen.getByText("Our product launched!");
      expect(msg).toBeTruthy();
    });
  });

  describe("Target date in the future", () => {
    beforeEach(async () => {
      var date = new Date();
      date.setDate(date.getDate() + 5);
      countdownGetReturn = new Promise((r) =>
        r({ deadline: { toDate: () => date.toISOString() } })
      );
      await act(async () => {
        render(
          <ThemeProvider theme={{ global: {} }}>
            <Main />
          </ThemeProvider>
        );
      });
    });

    test("Doesn't show launched message", () => {
      const msg = screen.queryByText("Our product launched!");
      expect(msg).toBeFalsy();
    });

    test("Shows time remaining", () => {
      const remaining = screen.getByTitle("Time Remaining").closest("h1");
      expect(remaining?.textContent?.replace(/\s/g, " ").trim()).toBe(
        "4 days 23 hours 59 minutes 59 seconds"
      );
    });
  });

  describe("Target date is seconds away", () => {
    beforeEach(async () => {
      var date = new Date();
      date.setSeconds(date.getSeconds() + 10);
      countdownGetReturn = new Promise((r) =>
        r({ deadline: { toDate: () => date.toISOString() } })
      );
      await act(async () => {
        render(
          <ThemeProvider theme={{ global: {} }}>
            <Main />
          </ThemeProvider>
        );
      });
    });

    test("Shows time remaining", () => {
      const remaining = screen.getByTitle("Time Remaining").closest("h1");
      expect(remaining?.textContent?.replace(/\s/g, " ").trim()).toBe(
        "9 seconds"
      );
    });
  });
});
