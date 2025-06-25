export default async function PlayerPage({
  params,
}: {
  params: Promise<{ lang: "ar" | "en" }>;
}) {
  const { lang } = await params;
  return <div>Player Page ({lang})</div>;
}
