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
        <code className="text-rosso-hover">mode=&quot;preview&quot;</code>: il
        testo persiste 1500ms, fade 400ms, poi i tendaggi si aprono in 2500ms e
        il componente si smonta da solo.
      </p>
      {active && (
        <Sipario mode="preview" onComplete={() => setActive(false)} />
      )}
    </div>
  );
}

export default SiparioPreloaderDemo;
