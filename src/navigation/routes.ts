export const ROUTES = {
  HOME: 'Home',
  PROJECTS: 'Projects',
  AR: 'AR',
  LOGIN: 'Login',
  REGISTER: 'Register',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
} as const;

export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];
