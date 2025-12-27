import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Bienvenido al Workshop 2025</h1>
      <br />
      <Button asChild>
        <a href="/users">Explora los usuarios</a>
      </Button>
    </main>
  );
}