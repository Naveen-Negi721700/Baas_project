"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/authContext";

const PUBLIC_PATHS = [
  "/",
  "/signin",
  "/signup",
  "/docs",
  "/pricing",
  "/signout",
];

const isPublic = (path) =>
  PUBLIC_PATHS.some((p) =>
    p === "/"
      ? path === "/"
      : path === p || path.startsWith(p + "/")
  );

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isProtected = !isPublic(pathname);

  useEffect(() => {
    if (loading || user || !isProtected) return;

    sessionStorage.setItem(
      "authMessage",
      "Please sign in first!"
    );

    router.replace("/signin");
  }, [loading, user, isProtected, router]);

  useEffect(() => {
    if (pathname !== "/signin") return;

    const message = sessionStorage.getItem("authMessage");

    if (message) {
      sessionStorage.removeItem("authMessage");

      toast.error(message, {
        toastId: "auth-required",
        theme: "dark",
        autoClose: 2000,
      });
    }
  }, [pathname]);

  if (isProtected && (loading || !user)) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-white/60 text-sm">
        Checking your login...
      </div>
    );
  }

  return children;
};

export default AuthGuard;