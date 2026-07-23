export default async function Client({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <h1>Client profile</h1>
      <p>Client ID: {id}</p>
    </main>
  );
}