import { isValidEmail } from "./functions";

describe("functions", () => {
  describe("isValidEmail", () => {
    it("return true with valid email", () => {
      const value = isValidEmail("me@me.com");
      expect(value).toBe(true);
    });

    it("return false with invalid email 1", () => {
      const value = isValidEmail("me@me.");
      expect(value).toBe(false);
    });

    it("return false with invalid email 2", () => {
      const value = isValidEmail("me@");
      expect(value).toBe(false);
    });

    it("return false with invalid email 3", () => {
      const value = isValidEmail("me");
      expect(value).toBe(false);
    });

    it("return false with invalid email 4", () => {
      const value = isValidEmail("");
      expect(value).toBe(false);
    });
  });
});
