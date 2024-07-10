export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
  }
  interface Product {
    name: string;
    desc: string;
    prepTime: number;
    price: number;
    ingredients: string;
  };
}