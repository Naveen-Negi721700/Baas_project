import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Sidebar from "./component/Sidebar";
import ChatPopup from "./component/ChatPopup";


import { AuthProvider } from "./context/authContext";
import { ProjectProvider } from "./context/projectContext";

import AuthGuard from "./component/authGuard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Backora",
  description: "Manage your backend with Backora",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ProjectProvider>
            <Navbar />
            <Sidebar />
            <AuthGuard>{children}</AuthGuard>
            <Footer />
            <ChatPopup />

            <ToastContainer position="top-right" autoClose={2000} />
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}