"use client";

import { useState } from "react";
import { Sipario } from "@/components/layout/Sipario";
import { Button } from "@/components/ui/Button";

export function SiparioPreloaderDemo() {
  const [active, setActive] = useState(false);
  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        size="md"
        onClick={() => setActive(true)}
        disabled={active}
      >
        {active ? "Sipario in apertura…" : "Anteprima sipario"}
      </Button>
      <p className="text-body-s text-crema-muted max-w-xl">
        Cliccando il bottone, il sipario si monta full-screen con{" "}
        <code className="text-rosso-hover">mode=&quot;preview&quot;</code>: parte
        immediatamente, salta l&apos;attesa di <code>window.load</code>, si apre
        in 1500ms, poi si smonta automaticamente.
      </p>
      {active && (
        <Sipario mode="preview" onComplete={() => setActive(false)} />
      )}
    </div>
  );
}

export default SiparioPreloaderDemo;
