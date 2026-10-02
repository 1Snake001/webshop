import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  // Ha már be van jelentkezve, irányítsuk a főoldalra
  if (session?.user) {
    redirect("/");
  }

  const { callbackUrl, error } = await searchParams;

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="border rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Bejelentkezés</h1>
            <p className="text-sm text-muted-foreground">
              Jelentkezz be a fiókodba
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-700 dark:text-red-300">
              {error === "CredentialsSignin" && "Hibás email vagy jelszó."}
              {error === "OAuthAccountNotLinked" &&
                "Ez az email már regisztrálva van másik bejelentkezési móddal."}
              {error !== "CredentialsSignin" &&
                error !== "OAuthAccountNotLinked" &&
                "Hiba történt a bejelentkezés során."}
            </div>
          )}

          <LoginForm callbackUrl={callbackUrl} />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Még nincs fiókod? </span>
            <Link href="/register" className="font-medium hover:underline">
              Regisztrálj!
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}