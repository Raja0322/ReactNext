"use client";

import { useState } from "react";

export default function ClientDemoPage() {
  const [showName, setShowName] = useState(false);

  return (
    <main>
      <h2>Client Component</h2>

      <button onClick={() => setShowName(true)}>
        Show Customer Name
      </button>

      {showName && <p>Customer: Raja</p>}
    </main>
  );
}