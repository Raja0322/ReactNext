
"use client";

import { useRouter } from "next/navigation";

import CustomerForm from "@/components/customers/CustomerForm";

import { createCustomer } from "@/services/customerService";

import { CreateCustomer } from "@/types/customer";

export default function CreateCustomerPage() {
  const router = useRouter();

  async function handleCreateCustomer(
    customer: CreateCustomer
  ) {
    await createCustomer(customer);

    alert("Customer created successfully");

    router.push("/customers");
  }

  return (
    <main>
      <h2>Create Customer</h2>

      <CustomerForm
        onSubmit={handleCreateCustomer}
      />
    </main>
  );
}

/*"use client";

import { useRouter } from "next/navigation";

export default function CreateCustomerPage() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <main>
      <h1>Create Customer</h1>

      <p>This is the Create Customer page.</p>

      <button onClick={handleBack}>
        Back
      </button>
    </main>
  );
} */

 /* "use client";

import { useState } from "react";

export default function CreateCustomerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Customer Name:", name);
    console.log("Customer Email:", email);

    alert("Customer saved successfully");
  }

  return (
    <main>
      <h2>Create Customer</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Customer Name: </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Save Customer
        </button>

      </form>
    </main>
  );
} */


 /* "use client";

import { useState } from "react";

export default function CreateCustomerPage() {
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

    const response = await fetch("/api/customers", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(customer),
    });

    const data = await response.json();

    console.log("API Response:", data);

    alert(data.message);
  }

  return (
    <main>
      <h2>Create Customer</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Customer Name: </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email: </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Save Customer
        </button>

      </form>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCustomerPage() {
  const router = useRouter();

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

    const response = await fetch("/api/customers", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(customer),
    });

    const data = await response.json();

    console.log("API Response:", data);

    alert(data.message);

    router.push("/customers");
  }

  return (
    <main>
      <h2>Create Customer</h2>

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
    </main>
  );
} */