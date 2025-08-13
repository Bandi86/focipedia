"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import AuthForm from "./AuthForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const { t } = useTranslation();
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="px-6">
          {t("common:buttons.login")} / {t("common:buttons.register")}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 w-[90vw] max-w-md shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {mode === "login" ? t("common:buttons.login") : t("common:buttons.register")}
            </Dialog.Title>
            <div className="flex gap-2">
              <Button onClick={() => setMode("login")} className="px-3 py-1">{t("common:buttons.login")}</Button>
              <Button onClick={() => setMode("register")} className="px-3 py-1">{t("common:buttons.register")}</Button>
            </div>
          </div>
          <AuthForm mode={mode} />
          <Dialog.Close asChild>
            <Button className="mt-4 w-full">{t("common:buttons.close")}</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


