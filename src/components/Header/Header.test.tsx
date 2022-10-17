import { render, screen } from "@testing-library/react";
import * as React from "react";
import userEvent from "@testing-library/user-event";
import { signOut } from "../../misc/firebase";
import { useRouter } from "next/router";
import { Header } from "./Header";
import { updateSharedUser } from "../../misc/sharedState";

let signOutReturn: Promise<void>;

jest.mock("../../misc/firebase", () => {
  return {
    __esModule: true,
    signOut: jest.fn(() => signOutReturn),
  };
});

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const routerPush = jest.fn();
let routerPathname = "/";
(useRouter as jest.Mock<any, any>).mockImplementation(() => ({
  push: routerPush,
  pathname: routerPathname,
}));

describe("Header", () => {
  describe("At root", () => {
    describe("Not logged in", () => {
      beforeEach(() => {
        signOutReturn = new Promise<void>((r) => r());
        render(<Header />);
      });

      test("Has source code link", () => {
        const link = screen.getByText("Source Code").closest("a");
        expect(link).toHaveAttribute(
          "href",
          "https://github.com/ManuelDeLeon/koala-countdown"
        );
      });

      test("Has home link", () => {
        const link = screen.getByTitle("Koala Countdown").closest("a");
        expect(link).toHaveAttribute("href", "/");
      });

      test("Has Login link", () => {
        const link = screen.getByText("Login").closest("a");
        expect(link).toHaveAttribute("href", "/login");
      });
    });

    describe("Not logged in", () => {
      beforeEach(() => {
        updateSharedUser({ email: "", name: "", uid: "" });
        signOutReturn = new Promise<void>((r) => r());
        render(<Header />);
      });

      test("Has Logout link", () => {
        const link = screen.getByText("Logout").closest("nav");
        expect(link).toBeTruthy();
      });

      describe("Click Logout", () => {
        beforeEach(async () => {
          const button = screen.getByText("Logout");
          await userEvent.click(button);
        });

        test("Called signOut", () => {
          expect(signOut).toHaveBeenCalled();
        });

        test("Redirects to home", () => {
          expect(routerPush).toHaveBeenCalledWith("/");
        });
      });
    });
  });

  describe("At Login", () => {
    beforeEach(() => {
      signOutReturn = new Promise<void>((r) => r());
      routerPathname = "/login";
      render(<Header />);
    });

    test("Doesn't have Login link", () => {
      const link = screen.queryByText("Login");
      expect(link).toBeFalsy();
    });
  });
});
