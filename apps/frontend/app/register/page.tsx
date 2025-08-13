import AuthForm from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Regisztráció</h1>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}


