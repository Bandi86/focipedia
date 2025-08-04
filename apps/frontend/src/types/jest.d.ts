import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveValue(value: string | number | string[]): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeRequired(): R;
      toHaveFocus(): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toBeChecked(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveAccessibleName(name: string | RegExp): R;
      toHaveAccessibleDescription(description: string | RegExp): R;
    }
  }
} 