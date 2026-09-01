// Simulates network latency for every mock endpoint below.
export const delay = (ms = 200) => new Promise<void>((resolve) => setTimeout(resolve, ms));
