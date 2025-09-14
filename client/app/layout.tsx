import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "./components/Web3Provider";

export const metadata: Metadata = {
    title: "Sneak",
    description: "Sneak",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Web3Provider>{children}</Web3Provider>
            </body>
        </html>
    );
}
