import { getUsers } from "../lib/userService";
import { Card } from "./ui/card";

type User = {
  id: string | number;
  name: string;
  email: string;
};

export default async function UserList() {
  let users: User[] = [];
  try {
    users = await getUsers();
  } catch {
    return <div className="text-red-500">Error cargando usuarios</div>;
  }

  if (!users.length) {
    return <div>No hay usuarios.</div>;
  }

  return (
    <div className="grid gap-4 w-full max-w-xl">
      {users.map((user) => (
        <Card key={user.id} className="p-4">
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-zinc-600">{user.email}</div>
        </Card>
      ))}
    </div>
  );
}
