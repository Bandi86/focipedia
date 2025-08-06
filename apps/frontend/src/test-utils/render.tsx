import React, { PropsWithChildren } from 'react';
import { render as rtlRender } from '@testing-library/react';

// If your components require providers (Theme, QueryClient, etc.), add them here.
function Providers({ children }: PropsWithChildren) {
  return children as React.ReactElement;
}

export function render(ui: React.ReactElement, options?: Parameters<typeof rtlRender>[1]) {
  return rtlRender(ui, { wrapper: Providers as React.ComponentType, ...options });
}

export * from '@testing-library/react';