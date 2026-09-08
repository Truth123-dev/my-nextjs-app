

import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

export const metadata = {
  title: "Workspace Auth",
  description: "Next.js Linear/Jira style auth mock.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
