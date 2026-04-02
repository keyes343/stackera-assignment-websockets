export * as comm from "./common";

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Stats_1 = "recently" | "oldest" | "most" | "least" | "alphabetically" | "rank";
export type Stats_2 = "added" | "updated" | "touched" | "tagged" | "searched" | "asc" | "desc" | "none";

export type StatOption_1_forDates = "added" | "updated" | "window lies" | "window falls" | "starts" | "ends" | null;
export type StatOption_2_forDates = "after" | "before" | "between" | "on" | null;

export const errorCommandsForFrontendToExecute = ["refreshTokenExpired"] as const;
export type ErrorCommandsForFrontendToExecute = (typeof errorCommandsForFrontendToExecute)[number];
