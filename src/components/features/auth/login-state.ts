/** Shape shared by the login server action and the client form. */
export interface LoginFormState {
  step: "email" | "otp";
  email: string;
  error?: string;
  notice?: string;
}

export const initialLoginState: LoginFormState = { step: "email", email: "" };
