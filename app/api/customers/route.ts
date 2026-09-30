import { customers } from "@/data/customers";
import { CreateCustomer } from "@/types/customer";

export async function GET() {
  return Response.json(customers);
}

export async function POST(request: Request) {
  const customer: CreateCustomer = await request.json();

  const newCustomer = {
    id: Date.now().toString(),
    name: customer.name,
    email: customer.email,
  };

  customers.push(newCustomer);

  return Response.json(
    {
      message: "Customer created successfully",
      customer: newCustomer,
    },
    {
      status: 201,
    }
  );
}