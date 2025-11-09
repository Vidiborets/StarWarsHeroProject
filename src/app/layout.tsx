import Header from "@/components/Header/Header";
import "./globals.css";
import Provider from "./provider";

export const metadata = { title: "SW Graph", description: "Star Wars graph" };

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Provider>
          <Header />
          <main className="container py-6">{children}</main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
