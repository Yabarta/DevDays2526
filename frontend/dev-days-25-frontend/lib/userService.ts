// lib/userService.ts
export async function getUsers() {
  console.log("Fetching users from API...");
  const res = await fetch("http://localhost:3000/api/v1/users", { cache: "no-store" });
  console.log("Fetch users response status:", res.status);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}