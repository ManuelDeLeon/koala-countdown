import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import { Login } from "./Login";
import userEvent from "@testing-library/user-event";
import { signIn } from "../../misc/firebase";
import { useRouter } from "next/router";

let signInReturn: Promise<void>;

jest.mock("../../misc/firebase", () => {
  return {
    __esModule: true,
    signIn: jest.fn(() => signInReturn),
  };
});

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const routerPush = jest.fn();
(useRouter as jest.Mock<any, any>).mockImplementation(() => ({
  push: routerPush,
}));

describe("Login", () => {
  describe("Initial state", () => {
    beforeEach(() => {
      signInReturn = new Promise<void>((r) => r());
      render(
        <ThemeProvider theme={{ global: {} }}>
          <Login />
        </ThemeProvider>
      );
    });

    describe("Links", () => {
      test("Has create account link", () => {
        const link = screen.getByText("Create account").closest("a");
        expect(link).toHaveAttribute("href", "/createAccount");
      });

      test("Has forgot password link", () => {
        const link = screen.getByText("Forgot password?").closest("a");
        expect(link).toHaveAttribute("href", "/forgotPassword");
      });
    });

    test("Doesn't have email error", () => {
      const emailError = screen.queryByText("Please enter your email");
      expect(emailError).toBeFalsy();
    });
    test("Doesn't have password error", () => {
      const emailError = screen.queryByText(
        "Password must be at least 10 characters long"
      );
      expect(emailError).toBeFalsy();
    });

    describe("Click Login", () => {
      beforeEach(async () => {
        const loginButton = screen.getByText("Login");
        await userEvent.click(loginButton);
      });

      test("Didn't call signIn", () => {
        expect(signIn).not.toHaveBeenCalled();
      });

      test("Shows email error", () => {
        const emailError = screen.queryByText("Please enter your email");
        expect(emailError).toBeTruthy();
      });
      test("Shows password error", () => {
        const emailError = screen.queryByText(
          "Password must be at least 10 characters long"
        );
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

    describe("Enter bad password", () => {
      beforeEach(() => {
        const input = screen.getByPlaceholderText("Password").closest("input");
        input && fireEvent.change(input, { target: { value: "123456789" } });
      });
      test("Shows password error", () => {
        const passwordError = screen.queryByText(
          "Password must be at least 10 characters long"
        );
        expect(passwordError).toBeTruthy();
      });
    });

    describe("Enter valid email and password", () => {
      beforeEach(() => {
        const inputEmail = screen
          .getByPlaceholderText("Email Address")
          .closest("input");
        const inputPassword = screen
          .getByPlaceholderText("Password")
          .closest("input");
        inputEmail &&
          fireEvent.change(inputEmail, { target: { value: "my@domain.com" } });
        inputPassword &&
          fireEvent.change(inputPassword, { target: { value: "1234567890" } });
      });
      test("Doesn't have email error", () => {
        const emailError = screen.queryByText("Please enter your email");
        expect(emailError).toBeFalsy();
      });
      test("Doesn't have password error", () => {
        const emailError = screen.queryByText(
          "Password must be at least 10 characters long"
        );
        expect(emailError).toBeFalsy();
      });

      describe("Click Login", () => {
        beforeEach(async () => {
          const loginButton = screen.getByText("Login");
          await userEvent.click(loginButton);
        });

        test("Redirects to home", () => {
          expect(routerPush).toHaveBeenCalledWith("/");
        });
      });

      const errorMessages = {
        "auth/wrong-password": "Wrong password.",
        "auth/user-not-found": "Email not found.",
        "Something else": "Something else",
      };

      for (let [errorCode, displayMessage] of Object.entries(errorMessages)) {
        describe(`signIn returns ${errorCode}`, () => {
          beforeEach(async () => {
            signInReturn = new Promise<void>((resolve, reject) =>
              reject({ code: errorCode })
            );
            signInReturn.catch(() => undefined);
          });

          describe("Click Login", () => {
            beforeEach(async () => {
              const loginButton = screen.getByText("Login");
              await userEvent.click(loginButton);
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
});
