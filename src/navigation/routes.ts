// navigation/routes.ts
export const ROUTES = {
  HOME: 'Home',
  AR: 'AR',
  LOGIN: 'Login',
  REGISTER: 'Register',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
} as const;

export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];
