import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, PasswordInput, Button, Title } from "@mantine/core";

interface SignupCredential {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupCredential>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupCredential) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <Title className="text-center mb-6">Sign Up</Title>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="Name"
            placeholder="Your name"
            {...register("firstName")}
            error={errors.firstName ? errors.firstName.message : null}
          />
          <TextInput
            label="Name"
            placeholder="Your name"
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
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
