"use client";

import { useState } from "react";
import { RevealSipario } from "@/components/effects/RevealSipario";
import { Button } from "@/components/ui/Button";

export function SiparioDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="space-y-4 mb-24">
      <Button
        variant="secondary"
        size="md"
        onClick={() => setK((v) => v + 1)}
      >
        Replay sipario
      </Button>
      <RevealSipario replayKey={k} className="rounded-md">
        <div className="aspect-[16/7] bg-gradient-hero flex items-center justify-center">
          <h3 className="font-display text-display-m text-crema-base">
            ALZA IL SIPARIO
          </h3>
        </div>
      </RevealSipario>
    </div>
  );
}

export default SiparioDemo;
