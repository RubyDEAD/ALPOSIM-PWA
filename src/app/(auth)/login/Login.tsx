"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoginSchema, LoginInput } from "@/src/schema/schema";

export default function LoginPageClient() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`,
        data
      );

      const { token, username, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      router.push("/dashboard");
    } catch {
      setError("root", { message: "Invalid username or password." });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-10 text-center">
          <span className="inline-block text-xs font-mono tracking-[0.3em] text-[#f59e0b] uppercase mb-3">
            Hardware POS
          </span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            alposim
          </h1>
          <p className="text-[#6b7280] text-sm mt-2">
            Sign in to manage your store
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username"
                className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#4b5563] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition"
              />
              {errors.username && (
                <p className="text-[#f87171] text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#4b5563] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition"
              />
              {errors.password && (
                <p className="text-[#f87171] text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Root error */}
            {errors.root && (
              <div className="bg-[#2a1a1a] border border-[#7f1d1d] text-[#f87171] text-sm px-4 py-3 rounded-lg">
                {errors.root.message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:bg-[#78350f] disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg text-sm transition duration-150"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}