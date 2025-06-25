export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: "ar" | "en" }>;
}) {
  const { lang } = await params;
  return <div>Admin Page ({lang})</div>;
}
