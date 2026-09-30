import Link from "next/link";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Customer Management</h1>

      <nav>
        <Link href="/customers">
          Customers
        </Link>

        {" | "}

        <Link href="/customers/create">
          Create Customer
        </Link>
      </nav>

      <hr />

      {children}
    </div>
  );
}