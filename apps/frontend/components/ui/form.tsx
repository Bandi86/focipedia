"use client";

/**
 * Form helpers (RHF + shadcn-szerű API)
 *
 * Cél: Egyszerű burkolók a React Hook Form köré, hogy egységes legyen a
 * label/mező/hiba/segédszöveg megjelenítés és a spacing.
 *
 * Használat:
 *   const form = useForm<T>(...);
 *   <Form {...form}>
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <FormField
 *         name="email"
 *         control={form.control}
 *         label="E-mail"
 *         description="Azonosítód az alkalmazásban"
 *         render={(fieldState) => (
 *           <Input type="email" placeholder="te@pelda.hu" {...fieldState} />
 *         )}
 *       />
 *       <Button type="submit">Küldés</Button>
 *     </form>
 *   </Form>
 */

import * as React from "react";
import type { FieldPath, FieldValues, UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { Controller } from "react-hook-form";

// Egyszerű context a RHF metódusokhoz
type FormContextValue<TFieldValues extends FieldValues = FieldValues> = UseFormReturn<TFieldValues>;
const FormContext = React.createContext<FormContextValue | null>(null);

export function Form<TFieldValues extends FieldValues = FieldValues>(
  props: { children: React.ReactNode } & UseFormReturn<TFieldValues>
) {
  const { children, ...methods } = props;
  return <FormContext.Provider value={methods as UseFormReturn<FieldValues>}>{children}</FormContext.Provider>;
}

export function useFormContextStrict() {
  const ctx = React.useContext(FormContext);
  if (!ctx) {
    throw new Error("Form: használat előtt add át a RHF metódusokat a <Form> komponensnek.");
  }
  return ctx;
}

type FormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  name: TName;
  control: UseFormReturn<TFieldValues>["control"];
  label?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * render: a Controllerből kapott field propokat (onChange, onBlur, value, ref, name) átadjuk
   * Megjegyzés: a komponensek (pl. Input) közvetlenül ráteríthetők a field-re.
   */
  render: (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode;
  className?: string;
};

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: FormFieldProps<TFieldValues, TName>) {
  const { name, control, label, description, render, className } = props;

  return (
    <div className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      {label ? (
        <label htmlFor={String(name)} className="text-sm font-medium">
          {label}
        </label>
      ) : null}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <React.Fragment>
            {/*
              A render visszaadja a tényleges kontrollt (pl. <Input />),
              a kapott field props-okkal. A hibát (invalid) propként is jelezheted.
            */}
            {render(field)}

            {description ? (
              <small className="text-xs text-muted-foreground">{description}</small>
            ) : null}

            {fieldState.error ? (
              <small className="text-red-600">{String(fieldState.error.message || "Érvénytelen mező")}</small>
            ) : null}
          </React.Fragment>
        )}
      />
    </div>
  );
}