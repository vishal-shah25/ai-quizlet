import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="text-2xl font-bold">Quiz App</h1>
      <Link href="/saved" className="text-lg">
        View Saved
      </Link>
    </header>
  );
}
