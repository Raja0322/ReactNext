import { customers } from "@/data/customers";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const { id } = await params;

  const customer = customers.find(
    (customer) => customer.id === id
  );

  if (!customer) {
    return Response.json(
      {
        message: "Customer not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(customer);
}