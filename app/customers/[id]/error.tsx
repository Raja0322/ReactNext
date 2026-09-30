"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main>
      <h2>Something went wrong!</h2>

      <p>Error: {error.message}</p>

      <button onClick={() => reset()}>
        Try Again
      </button>
    </main>
  );
}