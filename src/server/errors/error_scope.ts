export interface ErrorScope {
  name: string;
}

export function createErrorScope(name: string): ErrorScope {
  return { name };
}

export const EmptyErrorScope = createErrorScope('');

export const MiddlewareErrorScope = createErrorScope('middleware');
