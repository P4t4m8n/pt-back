import { jwtVerify } from "jose";
import { TAuthSignInDto, TAuthSignUpDto } from "../../../types/auth.type";
import { authUtil } from "../auth.util";

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

describe("authUtil", () => {
  describe("sanitizeSignUpDto", () => {
    it("should sanitize sign-up DTO", () => {
      const dto: TAuthSignUpDto = {
        email: "test@example.com",
        password: "Password123",
        firstName: "John",
        lastName: "Doe",
        imgUrl: "http://example.com/avatar.jpg",
      };

      const sanitizedDto = authUtil.sanitizeSignUpDto(dto);

      expect(sanitizedDto).toEqual({
        email: "test@example.com",
        password: "Password123",
        firstName: "John",
        lastName: "Doe",
        imgUrl: "http://example.com/avatar.jpg",
      });
    });
  });

  describe("validateSignUpDto", () => {
    it("should validate sign-up DTO", () => {
      const dto: TAuthSignUpDto = {
        email: "invalid-email",
        password: "pass",
        firstName: "J",
        lastName: "D",
        imgUrl: "",
      };

      const errors = authUtil.validateSignUpDto(dto);

      expect(errors).toEqual({
        email: "Please provide a valid email address.",
        password:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        firstName: "First Name must be at least 2 characters long.",
        lastName: "Last Name must be at least 2 characters long.",
      });
    });
  });

  describe("validateSignInDto", () => {
    it("should validate sign-in DTO", () => {
      const dto: TAuthSignInDto = {
        email: "invalid-email",
        password: "pass",
      };

      const errors = authUtil.validateSignInDto(dto);

      expect(errors).toEqual({
        email: "Please provide a valid email address.",
        password:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    });
  });

  describe("sanitizeSignInDto", () => {
    it("should sanitize sign-in DTO", () => {
      const dto: TAuthSignInDto = {
        email: "test@example.com",
        password: "Password123",
      };

      const sanitizedDto = authUtil.sanitizeSignInDto(dto);

      expect(sanitizedDto).toEqual({
        email: "test@example.com",
        password: "Password123",
      });
    });
  });

  describe("decodeToken", () => {
    it("should decode a valid token", async () => {
      const token = "valid-token";
      const payload = { sub: "1234567890", name: "John Doe", iat: 1516239022 };
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      const result = await authUtil.decodeToken(token);

      expect(result).toEqual(payload);
    });

    it("should return null for an invalid token", async () => {
      const token = "invalid-token";
      (jwtVerify as jest.Mock).mockRejectedValue(new Error("Invalid token"));

      const result = await authUtil.decodeToken(token);

      expect(result).toBeNull();
    });

    it("should return null if no token is provided", async () => {
      const result = await authUtil.decodeToken();

      expect(result).toBeNull();
    });
  });
  describe("validateSignUpDto", () => {
    it("should return no errors for a valid sign-up DTO", () => {
      const dto: TAuthSignUpDto = {
        email: "test@example.com",
        password: "Password123",
        firstName: "John",
        lastName: "Doe",
        imgUrl: "http://example.com/avatar.jpg",
      };

      const errors = authUtil.validateSignUpDto(dto);

      expect(errors).toEqual({});
    });

    it("should return errors for an invalid email", () => {
      const dto: TAuthSignUpDto = {
        email: "invalid-email",
        password: "Password123",
        firstName: "John",
        lastName: "Doe",
        imgUrl: "http://example.com/avatar.jpg",
      };

      const errors = authUtil.validateSignUpDto(dto);

      expect(errors).toEqual({
        email: "Please provide a valid email address.",
      });
    });

    it("should return errors for an invalid password", () => {
      const dto: TAuthSignUpDto = {
        email: "test@example.com",
        password: "pass",
        firstName: "John",
        lastName: "Doe",
        imgUrl: "http://example.com/avatar.jpg",
      };

      const errors = authUtil.validateSignUpDto(dto);

      expect(errors).toEqual({
        password:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    });

    it("should return errors for an invalid first name", () => {
      const dto: TAuthSignUpDto = {
        email: "test@example.com",
        password: "Password123",
        firstName: "J",
        lastName: "Doe",
        imgUrl: "http://example.com/avatar.jpg",
      };

      const errors = authUtil.validateSignUpDto(dto);

      expect(errors).toEqual({
        firstName: "First Name must be at least 2 characters long.",
      });
    });

    it("should return errors for an invalid last name", () => {
      const dto: TAuthSignUpDto = {
        email: "test@example.com",
        password: "Password123",
        firstName: "John",
        lastName: "D",
        imgUrl: "http://example.com/avatar.jpg",
      };

      const errors = authUtil.validateSignUpDto(dto);

      expect(errors).toEqual({
        lastName: "Last Name must be at least 2 characters long.",
      });
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const dto: TAuthSignUpDto = {
        email: "invalid-email",
        password: "pass",
        firstName: "J",
        lastName: "D",
        imgUrl: "http://example.com/avatar.jpg",
      };

      const errors = authUtil.validateSignUpDto(dto);

      expect(errors).toEqual({
        email: "Please provide a valid email address.",
        password:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        firstName: "First Name must be at least 2 characters long.",
        lastName: "Last Name must be at least 2 characters long.",
      });
    });
  });
});
