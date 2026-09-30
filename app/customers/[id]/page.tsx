"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Customer } from "@/types/customer";

import { getCustomerById } from "@/services/customerService";

import CustomerDetails from "@/components/customers/CustomerDetails";

export default function CustomerPage() {
  const params = useParams();

  const id = params.id as string;

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  async function loadCustomer() {
    const data = await getCustomerById(id);

await new Promise((resolve) => setTimeout(resolve, 2000));

    setCustomer(data);
  }

  if (!customer) {
    return <p>Loading customer...</p>;
  }

  return (
    <main>
      <CustomerDetails customer={customer} />
      
    </main>
  );
}

 



/*type CustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerPage({
  params,
}: CustomerPageProps) {
  const { id } = await params;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (id === "9999") {
    throw new Error("Customer service is unavailable");
  }

  return (
    <main>
      <h2>Customer Details</h2>

      <p>Customer ID: {id}</p>
    </main>
  );
} */

  /*import { notFound } from "next/navigation";

type CustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerPage({
  params,
}: CustomerPageProps) {
  const { id } = await params;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const validCustomerIds = ["1001", "1002", "1003"];

  if (!validCustomerIds.includes(id)) {
    notFound();
  }

  return (
    <main>
      <h2>Customer Details</h2>

      <p>Customer ID: {id}</p>
    </main>
  );
} 


  "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  email: string;
};

export default function CustomerPage() {
  const params = useParams();

  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  async function fetchCustomer() {
    const response = await fetch(`/api/customers/${id}`);

    const data = await response.json();

    setCustomer(data);
  }

  if (!customer) {
    return <p>Loading customer...</p>;
  }

  return (
    <main>
      <h2>Customer Details</h2>

      <p>ID: {customer.id}</p>
      <p>Name: {customer.name}</p>
      <p>Email: {customer.email}</p>
    </main>
  );
}*/