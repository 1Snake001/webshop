"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFormProps = {
  currentName: string;
  email: string;
};

export function ProfileForm({ currentName, email }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/account/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Hiba történt a mentés során.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEditing(false);
      setLoading(false);
      router.refresh();

      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Hiba történt a mentés során.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentName);
    setEditing(false);
    setError("");
  };

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Név</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kovács János"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Az email cím módosításához vedd fel velünk a kapcsolatot.
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mentés...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Mentés
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Mégse
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Név</Label>
        <p className="text-sm py-2">{name || "Nincs megadva"}</p>
      </div>

      <div className="space-y-1">
        <Label>Email</Label>
        <p className="text-sm py-2">{email}</p>
      </div>

      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">
          ✅ Adatok sikeresen frissítve!
        </p>
      )}

      <Button variant="outline" onClick={() => setEditing(true)}>
        <Pencil className="h-4 w-4 mr-2" />
        Szerkesztés
      </Button>
    </div>
  );
}