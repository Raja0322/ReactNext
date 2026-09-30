import {
  Customer,
  CreateCustomer,
} from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/customers");

  if (!response.ok) {
    throw new Error("Failed to get customers");
  }

  const data: Customer[] = await response.json();

  return data;
}

export async function getCustomerById(
  id: string
): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`);

  if (!response.ok) {
    throw new Error("Failed to get customer");
  }

  const data: Customer = await response.json();

  return data;
}

export async function createCustomer(
  customer: CreateCustomer
): Promise<Customer> {
  const response = await fetch("/api/customers", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Failed to create customer");
  }

  const data = await response.json();

  return data.customer;
}