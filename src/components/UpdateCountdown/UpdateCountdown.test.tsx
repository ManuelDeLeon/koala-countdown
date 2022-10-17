import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import { useRouter } from "next/router";
import { UpdateCountdown } from "./UpdateCountdown";
import { Countdown } from "../../models/Countdown";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

let timestampValue = "";
jest.mock("firebase/firestore", () => ({
  Timestamp: {
    fromDate: () => timestampValue,
  },
}));

let countdownGetReturn: Promise<{ deadline: { toDate: () => string } }> =
  new Promise((r) => r({ deadline: { toDate: () => "12/12/2012 11:34 AM" } }));
let countdownUpdateReturn: Promise<void> = new Promise<void>((r) => r());
jest.mock("../../models/Countdown", () => ({
  Countdown: {
    get: () => countdownGetReturn,
    update: jest.fn(),
  },
}));

(Countdown.update as jest.Mock<any, any>).mockImplementation(
  () => countdownUpdateReturn
);

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const routerPush = jest.fn();
(useRouter as jest.Mock<any, any>).mockImplementation(() => ({
  push: routerPush,
}));

describe("UpdateCountdown", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={{ global: {} }}>
          <UpdateCountdown />
        </ThemeProvider>
      );
    });
  });

  test("Datetime picker has default date/time", () => {
    const input = screen.getByLabelText("Launch Date").closest("input");
    expect(input?.value).toBe("12/12/2012 11:34 AM");
  });

  describe("Update date/time", () => {
    beforeEach(() => {
      const input = screen.getByLabelText("Launch Date").closest("input");
      input &&
        fireEvent.change(input, { target: { value: "12/12/2013 04:25 PM" } });
    });

    describe("Update date/time", () => {
      beforeEach(async () => {
        timestampValue = "12/12/2013 04:25 PM";
        const button = screen.getByText("Update Launch Date");
        await userEvent.click(button);
      });
      test("updates with last date/time", () => {
        expect(Countdown.update).toHaveBeenCalledWith("12/12/2013 04:25 PM");
      });
      test("Redirects to home", () => {
        expect(routerPush).toHaveBeenCalledWith("/");
      });
    });

    describe("Update throws error", () => {
      beforeEach(async () => {
        countdownUpdateReturn = new Promise<void>((resolve, reject) =>
          reject({ code: "Error Message" })
        );
        countdownUpdateReturn.catch(() => undefined);
        const button = screen.getByText("Update Launch Date");
        await userEvent.click(button);
      });
      test(`Displays Error Message`, () => {
        const error = screen.queryByText("Error Message");
        expect(error).toBeTruthy();
      });
    });
  });
});
