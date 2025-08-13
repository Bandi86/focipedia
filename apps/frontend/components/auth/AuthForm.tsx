'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useState as useReactState } from 'react';
import { Input } from '@/components/ui/input';

type Mode = 'login' | 'register';

const loginSchema = z.object({
  email: z.string().email({ message: 'Érvénytelen email' }),
  password: z.string().min(6, { message: 'Min. 6 karakter' }),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, { message: 'Min. 2 karakter' }),
    username: z.string().min(3, { message: 'Min. 3 karakter' }).regex(/^[a-zA-Z0-9_]+$/, { message: 'Csak betű, szám, aláhúzás' }),
    confirmPassword: z.string().min(6, { message: 'Min. 6 karakter' }),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    message: 'A jelszavak nem egyeznek',
    path: ['confirmPassword'],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/';
  const [serverError, setServerError] = useState<string | null>(null);
  const [availability, setAvailability] = useReactState<{ emailTaken?: boolean; nameTaken?: boolean; usernameTaken?: boolean }>({});

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    mode: 'onChange',
  });

  // Prefill from query or last attempt
  useEffect(() => {
    const email = sp.get('email') || '';
    const name = sp.get('name') || '';
    const pref = typeof window !== 'undefined' ? localStorage.getItem('auth_prefill') : null;
    let fromStorage: Partial<RegisterValues & LoginValues> = {};
    if (pref) {
      try {
        fromStorage = JSON.parse(pref);
      } catch {}
    }
    form.reset({
      ...(mode === 'register' ? { name: (name || fromStorage.name) as string } : {}),
      email: (email || fromStorage.email) as string,
      password: (fromStorage.password as string) || '',
      ...(mode === 'register'
        ? {
            confirmPassword: String(
              (fromStorage as Record<string, unknown>)?.confirmPassword || '',
            ),
          }
        : {}),
    } as unknown as LoginValues & Partial<RegisterValues>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Debounced availability check for register mode
  useEffect(() => {
    if (mode !== 'register') return;
    const sub = setTimeout(async () => {
      const values = form.getValues() as RegisterValues;
      if (!values.email && !values.name) return;
      try {
        const params = new URLSearchParams();
        if (values.email) params.set('email', values.email);
        if (values.name) params.set('name', values.name);
        const withUsername = values as RegisterValues;
        if (withUsername.username) params.set('username', withUsername.username);
        const res = await fetch(`/api/auth/availability?${params.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as { emailTaken?: boolean; nameTaken?: boolean; usernameTaken?: boolean };
          setAvailability(data);
        }
      } catch {
        // ignore
      }
    }, 400);
    return () => clearTimeout(sub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, form.watch('email'), form.watch('name')]);

  async function onSubmit(values: LoginValues | RegisterValues) {
    setServerError(null);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:
          mode === 'login'
            ? JSON.stringify({ email: values.email, password: values.password })
            : JSON.stringify({
                email: (values as RegisterValues).email,
                password: (values as RegisterValues).password,
                name: (values as RegisterValues).name,
                username: (values as RegisterValues).username,
              }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Hiba történt');
      }
      toast.success(mode === 'login' ? 'Sikeres bejelentkezés' : 'Sikeres regisztráció');
      if (typeof window !== 'undefined') localStorage.removeItem('auth_prefill');
    } catch (err: unknown) {
      if (typeof window !== 'undefined') {
        const toStore = { ...values } as Record<string, unknown>;
        delete toStore['password'];
        localStorage.setItem('auth_prefill', JSON.stringify(toStore));
      }
      const message = (err as Error)?.message || 'Hiba történt';
      setServerError(message);
      toast.error(message);
      return;
    }
    router.replace(next || '/dashboard');
  }

  const { register, handleSubmit, formState } = form;
  const errs = formState.errors as Record<string, { message?: string }>;
  const { isSubmitting } = formState;

  const passwordAutocomplete = mode === 'login' ? 'current-password' : 'new-password';
  const passwordValue = form.watch('password' as const) as string | undefined;
  const passwordStrength = (() => {
    const pw = passwordValue || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
  })();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm" aria-describedby={serverError ? 'auth-form-error' : undefined}>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <Input
          id="email"
          type="email"
          className="w-full"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errs.email)}
          aria-describedby={errs.email ? 'email-error' : undefined}
          {...register('email' as const)}
        />
        {availability.emailTaken && (
          <p className="text-xs text-red-600">Ez az email már regisztrálva van</p>
        )}
        {errs.email?.message && (
          <p id="email-error" className="text-xs text-red-600">{String(errs.email.message)}</p>
        )}
      </div>
      {mode === 'register' && (
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">Név</label>
          <Input
            id="name"
            type="text"
            className="w-full"
            placeholder="Teljes név"
            autoComplete="name"
            aria-invalid={Boolean(errs.name)}
            aria-describedby={errs.name ? 'name-error' : undefined}
            {...register('name' as unknown as 'name')}
          />
          {availability.nameTaken && (
            <p className="text-xs text-red-600">Ez a név már foglalt</p>
          )}
          {errs.name?.message && (
            <p id="name-error" className="text-xs text-red-600">{String(errs.name.message)}</p>
          )}
        </div>
      )}
      {mode === 'register' && (
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">Felhasználónév</label>
          <Input
            id="username"
            type="text"
            className="w-full"
            placeholder="pl. focifan_1990"
            autoComplete="username"
            aria-invalid={Boolean((errs as Record<string, { message?: string }>).username)}
            aria-describedby={(errs as Record<string, { message?: string }>).username ? 'username-error' : undefined}
            {...register('username' as unknown as 'username')}
          />
          {availability.usernameTaken && (
            <p className="text-xs text-red-600">Ez a felhasználónév már foglalt</p>
          )}
          {(errs as Record<string, { message?: string }>).username?.message && (
            <p id="username-error" className="text-xs text-red-600">{String((errs as Record<string, { message?: string }>).username.message)}</p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">Jelszó</label>
        <Input
          id="password"
          type="password"
          className="w-full"
          placeholder="••••••"
          autoComplete={passwordAutocomplete}
          aria-invalid={Boolean(errs.password)}
          aria-describedby={errs.password ? 'password-error' : undefined}
          {...register('password' as const)}
        />
        {mode === 'register' && (
          <div className="mt-1" aria-live="polite">
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className={
                  'h-2 rounded ' +
                  (passwordStrength <= 1
                    ? 'bg-red-500 w-1/4'
                    : passwordStrength === 2
                    ? 'bg-yellow-500 w-2/4'
                    : passwordStrength === 3
                    ? 'bg-blue-500 w-3/4'
                    : 'bg-green-600 w-full')
                }
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {passwordStrength <= 1 ? 'Gyenge' : passwordStrength === 2 ? 'Közepes' : passwordStrength === 3 ? 'Jó' : 'Erős'}
            </p>
          </div>
        )}
        {errs.password?.message && (
          <p id="password-error" className="text-xs text-red-600">{String(errs.password.message)}</p>
        )}
      </div>
      {mode === 'register' && (
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">Jelszó megerősítése</label>
          <div className="flex items-center gap-2">
            <Input
              id="confirmPassword"
              type="password"
              className="w-full"
              placeholder="••••••"
              autoComplete="new-password"
              aria-invalid={Boolean(errs.confirmPassword)}
              aria-describedby={errs.confirmPassword ? 'confirmPassword-error' : undefined}
              {...register('confirmPassword' as unknown as 'confirmPassword')}
            />
            <Button
              type="button"
              className="bg-transparent hover:bg-transparent text-blue-600 underline whitespace-nowrap"
              onClick={() => {
                const pw = form.getValues('password' as const) as string;
                form.setValue('confirmPassword' as unknown as 'confirmPassword', pw, { shouldValidate: true });
              }}
            >
              Másol
            </Button>
          </div>
          {errs.confirmPassword?.message && (
            <p id="confirmPassword-error" className="text-xs text-red-600">{String(errs.confirmPassword.message)}</p>
          )}
        </div>
      )}
      {serverError && (
        <div id="auth-form-error" className="text-sm text-red-600" role="alert" aria-live="polite">
          {serverError}
        </div>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        {mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}
      </Button>
      {mode === 'register' && (
        <div className="flex items-center justify-between gap-2">
          <small className="text-gray-500">Jelszó tipp: legalább 8 karakter, kis- és nagybetű, szám</small>
          <Button
            type="button"
            className="bg-transparent hover:bg-transparent text-blue-600 underline"
            onClick={() => {
              const alphabet = 'abcdefghijklmnopqrstuvwxyz';
              const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              const digits = '0123456789';
              const symbols = '!@#$%^&*()-_=+[]{};:,.?/';
              const all = alphabet + ALPHABET + digits + symbols;
              const length = 16;
              const arr = new Uint32Array(length);
              if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
                window.crypto.getRandomValues(arr);
              } else {
                for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff);
              }
              const chars = Array.from(arr, (n) => all[n % all.length]);
              // ensure at least one of each
              chars[0] = alphabet[arr[0] % alphabet.length];
              chars[1] = ALPHABET[arr[1] % ALPHABET.length];
              chars[2] = digits[arr[2] % digits.length];
              const pw = chars.join('');
              form.setValue('password' as const, pw, { shouldValidate: true });
              form.setValue('confirmPassword' as unknown as 'confirmPassword', pw, { shouldValidate: true });
            }}
          >
            Erős jelszó
          </Button>
        </div>
      )}
    </form>
  );
}

