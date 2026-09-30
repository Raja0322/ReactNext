import Link from "next/link";

export default function CustomerNotFound() {
  return (
    <main>
      <h2>Customer Not Found</h2>

      <p>The requested customer does not exist.</p>

      <Link href="/customers">
        Back to Customers
      </Link>
    </main>
  );
}