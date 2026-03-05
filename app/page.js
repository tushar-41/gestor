import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Gestor - Manager app</p>
        <div className="flex gap-2">
          <Link href={"/login"}>Login</Link>
          <Link href={"/signup"}>Register</Link>
        </div>
      </div>
    </div>
  );
}
