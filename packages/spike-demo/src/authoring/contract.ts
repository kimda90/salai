import type { NarrativeOperation } from "@salai/script-model";
import type { SalaiProjectContext } from "../controller";

export type AuthoringRequest = {
  instruction: string;
  context: SalaiProjectContext;
};

export type CreateStoryCommand = {
  command: "createStory";
  sectionTitle: string;
  beats: Array<{
    title: string;
    summary?: string;
  }>;
};

export type AuthoringCommand = CreateStoryCommand;

export type AuthoringResult = {
  summary: string;
  operations?: NarrativeOperation[];
  commands?: AuthoringCommand[];
  answer?: string;
};

export interface AuthoringAdapter {
  run(request: AuthoringRequest): Promise<unknown>;
}
