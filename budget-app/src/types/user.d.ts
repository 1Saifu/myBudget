import { User } from "@prisma/client";

export type UserRegistrationData = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UserLoginData = {
  email: string;
  password: string;
};

export type SafeUser = Omit<User, "password">;