/**
 * User shape set on req.user by the authenticate middleware.
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  plan: 'free' | 'pro';
}
