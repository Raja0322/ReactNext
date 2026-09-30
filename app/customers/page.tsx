

"use client";

import { useEffect, useState } from "react";

import { Customer } from "@/types/customer";

import { getCustomers } from "@/services/customerService";

import CustomerList from "@/components/customers/CustomerList";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const data = await getCustomers();

    setCustomers(data);
  }

  return (
    <main>
      <h2>Customers</h2>

      <CustomerList customers={customers} />
    </main>
  );
}






/*"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomersPage() {

  const router = useRouter();

  const customers = [
    { id: "1001", name: "Raja" },
    { id: "1002", name: "John" },
    { id: "1003", name: "David" },
  ];

  function handleCreateCustomer() {
    router.push("/customers/create");
  }

  return (
    <main>
      <h1>Customers</h1>

      {customers.map((customer) => (
        <p key={customer.id}>
          <Link href={`/customers/${customer.id}`}>
            {customer.name}
          </Link>
        </p>
      ))}

      <button onClick={handleCreateCustomer}>
        Create Customer button
      </button>
    </main>
  );
} */


  /*type CustomersPageProps = {
  searchParams: Promise<{
    name?: string;
    status?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {

  const { name, status } = await searchParams;

  return (
    <main>
      <h1>Customers</h1>

      <p>Name: {name}</p>
      <p>Status: {status}</p>
    </main>
  );
} */


 
/*import Link from "next/link";

export default function CustomersPage() {
  const customers = [
    { id: "1001", name: "Raja" },
    { id: "1002", name: "John" },
    { id: "1003", name: "David" },
  ];

  return (
    <main>
      <h2>Customers</h2>

      {customers.map((customer) => (
        <p key={customer.id}>
          <Link
            href={`/customers/${customer.id}`}
            prefetch={false}
          >
            {customer.name}
          </Link>
        </p>
      ))}
    </main>
  );
} */


 /* "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  email: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    const response = await fetch("/api/customers");

    const data = await response.json();

    setCustomers(data);
  }

  return (
    <main>
      <h2>Customers</h2>

      {customers.map((customer) => (
        <div key={customer.id}>
          <Link
            href={`/customers/${customer.id}`}
            prefetch={false}
          >
            {customer.name}
          </Link>

          <p>{customer.email}</p>
        </div>
      ))}
    </main>
  );
} */