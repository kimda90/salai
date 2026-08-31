import type { NarrativeOperation } from "@salai/script-model";
import type { SalaiProjectContext } from "../controller";

export type AuthoringRequest = {
  instruction: string;
  context: SalaiProjectContext;
};

export type AuthoringResult = {
  summary: string;
  operations?: NarrativeOperation[];
  answer?: string;
};

export interface AuthoringAdapter {
  run(request: AuthoringRequest): Promise<unknown>;
}
