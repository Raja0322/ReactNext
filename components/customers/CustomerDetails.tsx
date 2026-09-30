import { Customer } from "@/types/customer";

type CustomerDetailsProps = {
  customer: Customer;
};

export default function CustomerDetails({
  customer,
}: CustomerDetailsProps) {
  return (
    <div>
      <h2>Customer Details</h2>

      <p>ID: {customer.id}</p>

      <p>Name: {customer.name}</p>

      <p>Email: {customer.email}</p>
    </div>
  );
}