"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { login } from "@/store/feature/authSlice";

interface DecodedToken {
  userId: number | string;
}

const GoogleAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const effectRan = useRef(false);

  // State for controlling your UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    try {
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      const name = searchParams.get("name");
      const avatar_url = searchParams.get("avatar_url");
      if (!token || !email || !name) {
        const errorMessage = "Incomplete authentication data received.";
        toast.error(errorMessage);
        setError(errorMessage); // CHANGED: Set error state for the UI
        setLoading(false); // CHANGED: Turn off loading state
        return;
      }

      const decodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.userId.toString();

      localStorage.setItem("token", token);

      const userPayload = {
        id: userId,
        name: name,
        email: email,
        token: token,
        avatar_url: avatar_url || undefined,
      };

      dispatch(login(userPayload));
      toast.success("Successfully logged in! Redirecting...");
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = "An error occurred during login. Please try again.";
      console.error("Authentication processing failed:", err);
      toast.error(errorMessage);
      setError(errorMessage); // CHANGED: Set error state for the UI
      setLoading(false); // CHANGED: Turn off loading state
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-neutral-950/70 backdrop-blur-lg border border-neutral-800 text-center">
        {loading && (
          <>
            <div className="relative w-14 h-14 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-violet-300/20 animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-neutral-900"></div>
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-violet-400">
              Processing Google Login...
            </h1>
            <p className="text-neutral-400 mt-3">
              Please wait while we verify your account
            </p>
          </>
        )}

        {error && (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-3">
              Authentication Failed
            </h1>
            <p className="text-neutral-400">{error}</p>
            <button
              onClick={() => router.push("/auth/login")} // It's better to redirect than reload
              className="mt-6 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition-colors text-white font-medium shadow-md"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleAuth;
