import Link from "next/link";
import { Customer } from "@/types/customer";

type CustomerListProps = {
  customers: Customer[];
};

export default function CustomerList({
  customers,
}: CustomerListProps) {
  return (
    <div>
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
    </div>
  );
}