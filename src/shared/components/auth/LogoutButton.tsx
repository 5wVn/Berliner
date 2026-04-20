"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconLogout as LogOut } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/Button";
import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await logoutAction();
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.push("/");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="destructive"
        onClick={handleClick}
        disabled={isPending}
        className="w-full sm:w-fit"
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isPending ? "Déconnexion..." : "Se déconnecter"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
