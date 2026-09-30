export default function ServerDemoPage() {
  const customer = {
    id: "1001",
    name: "Raja",
    status: "Active",
  };

  return (
    <main>
      <h2>Server Component</h2>

      <p>ID: {customer.id}</p>
      <p>Name: {customer.name}</p>
      <p>Status: {customer.status}</p>
    </main>
  );
}