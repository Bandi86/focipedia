"use client";

/**
 * Megjegyzés: A projekt jelenleg nem tartalmaz @types/react-ot.
 * A zod verziójában a required_error nem elérhető, ezért min(1, ...) szabállyal jelezzük a kötelezőséget.
 * Auth-only oldal: ha a felhasználó már be van jelentkezve, átirányítjuk a /dashboard oldalra.
 *
 * Hibakezelés: A bejelentkezés tipikus hibáit (hibás jelszó, lejárt/érvénytelen token, hálózat/offline)
 * a hook-ok magyar nyelvű toast üzenetekben jelenítik meg (lásd: useAuth.ts getFriendlyAuthMessage).
 * Itt nem szükséges további UI módosítás.
 *
 * UI migráció (komment, nem módosít kódot):
 * - A natív <input> helyett használható az új <Input /> (apps/frontend/components/ui/input.tsx),
 *   amely kezeli az aria-invalid állapotot és egységes stílust ad.
 * - A natív <button> helyett használható az új <Button /> (apps/frontend/components/ui/button.tsx),
 *   variant: "default" | "outline" | "ghost", size: "sm" | "md", loading támogatással.
 * - Form layout egységesítéshez <Form /> és <FormField /> (apps/frontend/components/ui/form.tsx)
 *   használható a React Hook Form fölött:
 *
 *   Példa (csere iránya, NEM futó kód):
 *     import { Form, FormField } from "@/components/ui/form";
 *     import { Input } from "@/components/ui/input";
 *     import { Button } from "@/components/ui/button";
 *
 *     <Form {...form}>
 *       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
 *         <FormField
 *           name="email"
 *           control={form.control}
 *           label="E-mail"
 *           render={(field) => (<Input type="email" placeholder="te@pelda.hu" {...field} />)}
 *         />
 *         <FormField
 *           name="password"
 *           control={form.control}
 *           label="Jelszó"
 *           render={(field) => (<Input type="password" placeholder="••••••••" {...field} />)}
 *         />
 *         <Button type="submit" loading={isPending} className="w-full">
 *           {isPending ? "Bejelentkezés..." : "Bejelentkezés"}
 *         </Button>
 *       </form>
 *     </Form>
 */

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "../../../hooks/useAuth";
import RedirectIfAuthenticated from "../../../components/auth/RedirectIfAuthenticated";

const LoginSchema = z.object({
  email: z.string().min(1, "E-mail kötelező").email("Érvénytelen e-mail formátum"),
  password: z.string().min(8, "A jelszónak legalább 8 karakterből kell állnia"),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: LoginValues) {
    try {
      await login(values);
      router.push("/");
    } catch {
      // useLogin onError már toast-ol
    }
  }

  return (
    <RedirectIfAuthenticated to="/dashboard">
      <>
        <div className="mx-auto max-w-sm w-full p-6">
          <h1 className="text-2xl font-semibold mb-1">Bejelentkezés</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Lépj be az e-mail címeddel és jelszavaddal.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                placeholder="te@pelda.hu"
                autoComplete="email"
                aria-invalid={!!form.formState.errors.email || undefined}
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <small className="text-red-600">{form.formState.errors.email.message}</small>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium">
                Jelszó
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!form.formState.errors.password || undefined}
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <small className="text-red-600">{form.formState.errors.password.message}</small>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="inline-flex items-center justify-center w-full h-10 rounded-md bg-black text-white disabled:opacity-70"
            >
              {isPending ? "Bejelentkezés..." : "Bejelentkezés"}
            </button>
          </form>

          <div className="mt-6 text-sm">
            Nincs fiókod?{" "}
            <a href="/register" className="underline underline-offset-2 hover:opacity-80">
              Regisztráció
            </a>
          </div>
        </div>
      </>
    </RedirectIfAuthenticated>
  );
}