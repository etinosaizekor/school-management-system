import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, PasswordInput, Button, Title } from "@mantine/core";
import { useLoginMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Credentials {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const [loginErrorMessage, setloginErrorMessage] = useState("");
  const [login, { isSuccess, isError, error }] = useLoginMutation();

  const onSubmit = (loginCredentials: Credentials) => {
    login(loginCredentials);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    } else if (isError) {
      let errorMessage;
      if ("data" in error) {
        const errorData: any = error.data;
        errorMessage =
          errorData.message ||
          "Error occured while fetching students. Try again";
      }
      setloginErrorMessage(errorMessage);
    }
  }, [error, isError, isSuccess]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <Title className="text-center mb-6">Login</Title>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {error && <p className="text-red-500">{loginErrorMessage}</p>}
          <Button type="submit" fullWidth>
            Login
          </Button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
