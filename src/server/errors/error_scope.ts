export interface ErrorScope {
  name: string;
}

export function createErrorScope(name: string): ErrorScope {
  return { name };
}

export const EmptyErrorScope = createErrorScope('');

export const MiddlewareErrorScope = createErrorScope('middleware');

// Services Error Scope

export const BonusAllServiceErrorScope = createErrorScope('BonusAllService');
export const BonusDepartmentServiceErrorScope = createErrorScope('BonusDepartmentService');

// EHR Model Error Scope
export const PeriodModelErrorScope = createErrorScope('Period Model');
