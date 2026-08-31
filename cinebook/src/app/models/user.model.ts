export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  preferences: {
    preferredLanguage: string;
    preferredFormat: string;
  };
}
