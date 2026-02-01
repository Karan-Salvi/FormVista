import { ApiResponse } from '../../shared/interfaces/response.interface.js';
import { IPlan } from './plan.model.js';
import { ISubscription } from './subscription.model.js';

export interface CreateCheckoutSessionRequest {
  planId: string;
}

export interface CheckoutSessionResponseData {
  sessionId: string;
  url: string | null;
}

export interface PlanResponseData extends Partial<IPlan> {
  id: string;
}

export interface SubscriptionResponseData extends Partial<ISubscription> {
  id: string;
  plan?: PlanResponseData;
}

export type CheckoutSessionResponse = ApiResponse<CheckoutSessionResponseData>;
export type PlansResponse = ApiResponse<PlanResponseData[]>;
export type SubscriptionResponse = ApiResponse<SubscriptionResponseData>;
