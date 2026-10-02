import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const session = await auth();

  // Ha már be van jelentkezve, irányítsuk a főoldalra
  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="border rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Regisztráció</h1>
            <p className="text-sm text-muted-foreground">
              Hozz létre egy új fiókot
            </p>
          </div>

          <RegisterForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Már van fiókod? </span>
            <Link href="/login" className="font-medium hover:underline">
              Jelentkezz be!
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}