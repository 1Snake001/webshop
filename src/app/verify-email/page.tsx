"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Hiányzó token. Ellenőrizd a linket.");
      return;
    }

    // API hívás
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email cím sikeresen megerősítve!");
        } else {
          setStatus("error");
          setMessage(data.error || "Hiba történt a megerősítés során.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Hiba történt a megerősítés során.");
      });
  }, [searchParams]);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="border rounded-lg p-8 space-y-6 text-center">
          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold">Megerősítés...</h1>
              <p className="text-sm text-muted-foreground">
                Kérjük, várj, amíg megerősítjük az email címed.
              </p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Sikeres megerősítés! 🎉</h1>
              <p className="text-sm text-muted-foreground">
                Az email címed megerősítve. Most már be tudsz jelentkezni!
              </p>
              <Link href="/login" className="block">
                <Button className="w-full">Bejelentkezés</Button>
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Hiba történt</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
              <div className="flex flex-col gap-2">
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full">
                    Új regisztráció
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full">
                    Vissza a főoldalra
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}