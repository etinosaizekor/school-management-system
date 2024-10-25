import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, PasswordInput, Button, Title } from "@mantine/core";
import { useSignupMutation } from "../api/authApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupCredential {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupCredential>({
    resolver: zodResolver(signupSchema),
  });

  const [signup, { isSuccess, isError, error }] = useSignupMutation();
  const [signupErrorMessage, setsignupErrorMessage] = useState("");

  const onSubmit = (data: SignupCredential) => {
    signup(data);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    } else if (isError) {
      let errorMessage;
      if ("data" in error) {
        const errorData: any = error.data;
        errorMessage =
          errorData.message ||
          "Error occured while fetching students. Try again";
      }
      setsignupErrorMessage(errorMessage);
    }
  }, [error, isError, isSuccess]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <Title className="text-center mb-6">Sign Up</Title>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...register("firstName")}
            error={errors.firstName ? errors.firstName.message : null}
          />
          <TextInput
            label="Last name"
            placeholder="Enter last name"
            {...register("lastName")}
            error={errors.lastName ? errors.lastName.message : null}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email ? errors.email.message : null}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...register("password")}
            error={errors.password ? errors.password.message : null}
          />
          {signupErrorMessage && (
            <p className="text-red-500">{signupErrorMessage}</p>
          )}

          <Button type="submit" fullWidth>
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email").email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
