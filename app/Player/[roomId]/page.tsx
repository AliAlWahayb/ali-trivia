import Buzzer from "./Buzzer";

export default async function Room({ params }: { params: { roomId: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { roomId } = await params;

  return (
    <div className="flex flex-col items-center justify-baseline  p-5 min-h-screen bg-background-light">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold mb-3 text-text-primary">alisaw11</h1>
        <h4 className="text-lg font-semibold text-text-secondary">Score 12</h4>
      </div>
      <Buzzer />
    </div>
  );
}
