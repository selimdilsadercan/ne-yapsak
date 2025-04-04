"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function SignInPrompt() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold">Ne Yapsak&apos;a Hoş Geldiniz</h1>
      <p className="text-muted-foreground">Yapılacak aktiviteleri keşfetmek için giriş yapın</p>
      <SignInButton mode="modal">
        <Button size="lg" className="gap-2">
          <LogIn className="h-4 w-4" />
          Giriş Yap
        </Button>
      </SignInButton>
    </div>
  );
}
