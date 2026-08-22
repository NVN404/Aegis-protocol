import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monad Passkey SDK — Example",
  description:
    "A minimal Next.js demo showing @monad-passkey/react integration: FaceID/TouchID passkeys verified natively on Monad via precompile 0x0100.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
