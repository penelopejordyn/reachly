import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

import './globals.css'
import { PostsProvider } from './PostsContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostsProvider>
          {children}
        </PostsProvider>
      </body>
    </html>
  );
}

