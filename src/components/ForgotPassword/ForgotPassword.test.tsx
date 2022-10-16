import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import { resetPassword } from "../../misc/firebase";
import { useRouter } from "next/router";
import { ForgotPassword } from "./ForgotPassword";

let resetPasswordReturn: Promise<void>;

jest.mock("../../misc/firebase", () => {
  return {
    __esModule: true,
    resetPassword: jest.fn(() => resetPasswordReturn),
  };
});

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const routerPush = jest.fn();
(useRouter as jest.Mock<any, any>).mockImplementation(() => ({
  push: routerPush,
}));

describe("ForgotPassword", () => {
  beforeEach(() => {
    resetPasswordReturn = new Promise<void>((r) => r());
    render(
      <ThemeProvider theme={{ global: {} }}>
        <ForgotPassword />
      </ThemeProvider>
    );
  });

  test("Doesn't have email error", () => {
    const emailError = screen.queryByText("Please enter your email");
    expect(emailError).toBeFalsy();
  });

  describe("Click Reset Password", () => {
    beforeEach(async () => {
      const button = screen.getByText("Reset Password");
      await userEvent.click(button);
    });

    test("Didn't call resetPassword", () => {
      expect(resetPassword).not.toHaveBeenCalled();
    });

    test("Shows email error", () => {
      const emailError = screen.queryByText("Please enter your email");
      expect(emailError).toBeTruthy();
    });
  });

  describe("Enter bad email", () => {
    beforeEach(() => {
      const input = screen
        .getByPlaceholderText("Email Address")
        .closest("input");
      input && fireEvent.change(input, { target: { value: "my@" } });
    });
    test("Shows email error", () => {
      const emailError = screen.queryByText("Please enter your email");
      expect(emailError).toBeTruthy();
    });
  });

  describe("Enter valid email ", () => {
    beforeEach(() => {
      const inputEmail = screen
        .getByPlaceholderText("Email Address")
        .closest("input");
      inputEmail &&
        fireEvent.change(inputEmail, { target: { value: "my@domain.com" } });
    });
    test("Doesn't have email error", () => {
      const emailError = screen.queryByText("Please enter your email");
      expect(emailError).toBeFalsy();
    });

    describe("Click Reset Password - no wait", () => {
      beforeEach(async () => {
        const button = screen.getByText("Reset Password");
        await userEvent.click(button);
      });

      test("Doesn't immediately redirects", () => {
        expect(routerPush).not.toHaveBeenCalled();
      });
    });

    describe("Click Reset Password - simulate wait", () => {
      let setTimeoutReal = global.setTimeout;
      beforeEach(async () => {
        (global as any).setTimeout = (f: any) => f();
        const button = screen.getByText("Reset Password");
        await userEvent.click(button);
      });

      afterEach(async () => {
        global.setTimeout = setTimeoutReal;
      });

      test("Redirects to login", () => {
        expect(routerPush).toHaveBeenCalledWith("/login");
      });
    });

    const errorMessages = {
      "auth/user-not-found": "Email not found.",
      "Something else": "Something else",
    };

    for (let [errorCode, displayMessage] of Object.entries(errorMessages)) {
      describe(`resetPassword returns ${errorCode}`, () => {
        beforeEach(async () => {
          resetPasswordReturn = new Promise<void>((resolve, reject) =>
            reject({ code: errorCode })
          );
          resetPasswordReturn.catch(() => undefined);
        });

        describe("Click Reset Password", () => {
          beforeEach(async () => {
            const button = screen.getByText("Reset Password");
            await userEvent.click(button);
          });

          test(`Displays error: ${displayMessage}`, () => {
            const passwordError = screen.queryByText(displayMessage);
            expect(passwordError).toBeTruthy();
          });
        });
      });
    }
  });
});
