// Generic cross-module primitives. Domain-specific DTOs live in each module's own types.ts.

export type ID = string;
export type ProductID = string;
export type UserID = string;

// function getUser(id: UserID) {}
// function getProduct(id: ProductID) {}

// Structural (vs Nominal) Type System (Duck Typing)

// interface Point {
//   x: number;
//   y: number;
// }

// interface Vector {
//   x: number;
//   y: number;
//   length: number
// }

// let p = {} as Point;
// let v = {} as Vector;

// p = v; // Covariant
// v = p;
