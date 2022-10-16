import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import { createAccount } from "../../misc/firebase";
import { useRouter } from "next/router";
import { CreateAccount } from "./CreateAccount";

let createAccountReturn: Promise<void>;

jest.mock("../../misc/firebase", () => {
  return {
    __esModule: true,
    createAccount: jest.fn(() => createAccountReturn),
  };
});

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const routerPush = jest.fn();
(useRouter as jest.Mock<any, any>).mockImplementation(() => ({
  push: routerPush,
}));

describe("CreateAccount", () => {
  beforeEach(() => {
    createAccountReturn = new Promise<void>((r) => r());
    render(
      <ThemeProvider theme={{ global: {} }}>
        <CreateAccount />
      </ThemeProvider>
    );
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

  describe("Click Create Account", () => {
    beforeEach(async () => {
      const button = screen.getByText("Create Account");
      await userEvent.click(button);
    });

    test("Didn't call createAccount", () => {
      expect(createAccount).not.toHaveBeenCalled();
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

    describe("Click Create Account", () => {
      beforeEach(async () => {
        const button = screen.getByText("Create Account");
        await userEvent.click(button);
      });

      test("Redirects to home", () => {
        expect(routerPush).toHaveBeenCalledWith("/");
      });
    });

    const errorMessages = {
      "auth/email-already-in-use":
        "We already have an account with that email.",
      "Something else": "Something else",
    };

    for (let [errorCode, displayMessage] of Object.entries(errorMessages)) {
      describe(`createAccount returns ${errorCode}`, () => {
        beforeEach(async () => {
          createAccountReturn = new Promise<void>((resolve, reject) =>
            reject({ code: errorCode })
          );
          createAccountReturn.catch(() => undefined);
        });

        describe("Click Create Account", () => {
          beforeEach(async () => {
            const button = screen.getByText("Create Account");
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
