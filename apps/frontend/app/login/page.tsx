import AuthForm from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Bejelentkezés</h1>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}


