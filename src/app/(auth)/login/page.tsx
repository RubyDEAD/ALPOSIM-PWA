import type { Metadata } from "next";
import LoginPageClient from "./Login";


export const metadata: Metadata = {
    title: 'Login to ALPOSIM',
    description: 'Login to Proceed'
}

export default function LoginPage() {
    return <LoginPageClient />;
}