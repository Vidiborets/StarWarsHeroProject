import "./globals.css";
import Provider from "./provider";

export const metadata = { title: "SW Graph", description: "Star Wars graph" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
