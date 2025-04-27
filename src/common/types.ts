import { DateTime, Num, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const CreateJobSchema = z.object({
  url: Str({ required: true, description: "Job url", example: "https://example.com/job" }),
  title: Str({ required: true, description: "Job title", example: "Full Stack Developer" }),
  description: Str({ required: false, description: "Job description", example: "We are looking for a full stack developer..." }),
  company: Str({ required: true, description: "Company name", example: "Cloudflare" }),
  location: Str({ required: false, description: "Location", example: "San Francisco" }),
  logo: Str({ required: false, description: "Company logo URL", example: "https://example.com/logo.png" }),
  status: z.enum(["applied", "in_progress", "offre", "rejected"]).default("applied"),
});
export type CreateJobType = z.infer<typeof CreateJobSchema>

export const JobInternalFieldsSchema = z.object({
  id: Num({ description: "Job ID" }),
  createdAt: DateTime({ description: "Job creation date" }),
  updatedAt: DateTime({ description: "Job update date" }),
});

export const JobSchema = JobInternalFieldsSchema.merge(CreateJobSchema);
export type JobType = z.infer<typeof JobSchema>