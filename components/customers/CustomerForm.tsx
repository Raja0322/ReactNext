"use client";

import { useState } from "react";
import { CreateCustomer } from "@/types/customer";

type CustomerFormProps = {
  onSubmit: (customer: CreateCustomer) => Promise<void>;
};

export default function CustomerForm({
  onSubmit,
}: CustomerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const customer = {
      name,
      email,
    };

    await onSubmit(customer);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Customer Name: </label>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />
      </div>

      <br />

      <div>
        <label>Email: </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />
      </div>

      <br />

      <button type="submit">
        Save Customer
      </button>
    </form>
  );
}