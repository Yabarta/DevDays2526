import UserList from "@/components/UserList";

export default function UsersPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">Usuarios</h1>
      <UserList />
    </main>
  );
}