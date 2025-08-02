"use client";

/**
 * Megjegyzés: A projekt jelenleg nem tartalmaz @types/react-ot.
 * A JSX típus hibák elkerülésére hozzáadunk egy lokális minimális JSX deklarációt
 * kizárólag ehhez a fájlhoz (nem ütközik mással).
 * Auth-only oldal: ha a felhasználó már be van jelentkezve, átirányítjuk a /dashboard oldalra.
 *
 * Hibakezelés: A regisztráció közbeni tipikus hibák (ütköző e-mail, hálózat/offline)
 * a hook-ok magyar nyelvű toast üzenetekben jelennek meg (lásd: useAuth.ts getFriendlyAuthMessage).
 * Itt nem szükséges további UI módosítás.
 *
 * UI migráció (komment, nem módosít kódot):
 * - A natív <input> helyett használható az új <Input /> (apps/frontend/components/ui/input.tsx),
 *   amely aria-invalid/disabled állapotot egységesen kezeli.
 * - A natív <button> helyett használható az új <Button /> (apps/frontend/components/ui/button.tsx),
 *   variant: "default" | "outline" | "ghost", size: "sm" | "md", loading támogatással.
 * - Egyszerű, egységes űrlapelrendezéshez <Form /> és <FormField /> (apps/frontend/components/ui/form.tsx)
 *   a React Hook Form felett:
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
 *           {isPending ? "Regisztráció..." : "Regisztráció"}
 *         </Button>
 *       </form>
 *     </Form>
 */
 export {};
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRegister } from "../../../hooks/useAuth";
import RedirectIfAuthenticated from "../../../components/auth/RedirectIfAuthenticated";

/**
 * Regisztráció űrlap séma
 * - name: opcionális, trimelve
 * - email: kötelező, érvényes email
 * - password: kötelező, min 8 karakter
 * - passwordConfirm: egyezzen a password-del
 */
const RegisterSchema = z
  .object({
    name: z.string().trim().optional(),
    email: z.string().min(1, "E-mail kötelező").email("Érvénytelen e-mail formátum"),
    password: z.string().min(8, "A jelszónak legalább 8 karakterből kell állnia"),
    passwordConfirm: z.string().min(8, "A jelszó megerősítése kötelező"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "A jelszavak nem egyeznek",
    path: ["passwordConfirm"],
  });

type RegisterValues = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: registerMut, isPending } = useRegister();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", passwordConfirm: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: RegisterValues) {
    try {
      // A backend RegisterPayload nem vár passwordConfirm mezőt, ezért nem küldjük fel.
      await registerMut({
        name: values.name || undefined,
        email: values.email,
        password: values.password,
      });
      router.push("/");
    } catch {
      // useRegister onError már toast-ol
    }
  }

  return (
    <RedirectIfAuthenticated to="/dashboard">
      <>
        <div className="mx-auto max-w-sm w-full p-6">
          <h1 className="text-2xl font-semibold mb-1">Regisztráció</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Hozz létre egy fiókot az alábbi űrlappal.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Név (opcionális) */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">
                Név (opcionális)
              </label>
              <input
                id="name"
                type="text"
                placeholder="Teljes neved"
                autoComplete="name"
                aria-invalid={!!form.formState.errors.name || undefined}
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <small className="text-red-600">{String(form.formState.errors.name.message)}</small>
              ) : null}
            </div>

            {/* E-mail */}
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

            {/* Jelszó */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium">
                Jelszó
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!form.formState.errors.password || undefined}
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <small className="text-red-600">{form.formState.errors.password.message}</small>
              ) : null}
            </div>

            {/* Jelszó megerősítése */}
            <div className="flex flex-col gap-1">
              <label htmlFor="passwordConfirm" className="text-sm font-medium">
                Jelszó megerősítése
              </label>
              <input
                id="passwordConfirm"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!form.formState.errors.passwordConfirm || undefined}
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                {...form.register("passwordConfirm")}
              />
              {form.formState.errors.passwordConfirm ? (
                <small className="text-red-600">{form.formState.errors.passwordConfirm.message}</small>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="inline-flex items-center justify-center w-full h-10 rounded-md bg-black text-white disabled:opacity-70"
            >
              {isPending ? "Regisztráció..." : "Regisztráció"}
            </button>
          </form>

          <div className="mt-6 text-sm">
            Van fiókod?{" "}
            <a href="/login" className="underline underline-offset-2 hover:opacity-80">
              Bejelentkezés
            </a>
          </div>
        </div>
      </>
    </RedirectIfAuthenticated>
  );
}