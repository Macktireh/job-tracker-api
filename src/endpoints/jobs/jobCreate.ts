import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

import { type AppContext, CreateJobSchema, JobSchema } from "@/common/types";
import { JobRepository } from "@/repository/jobRepository";
import { ConflictError } from "@/common/errors";

export class JobCreate extends OpenAPIRoute {
  schema = {
    tags: ["Jobs"],
    summary: "Create a new Job",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateJobSchema,
          },
        },
      },
    },
    responses: {
      "201": {
        description: "Returns the created job",
        content: {
          "application/json": {
            schema: JobSchema,
          },
        },
      },
      "400": {
        description: "Returns a bad request message",
        content: {
          "application/json": {
            schema: z.object({
              errors: z.array(
                z
                  .object({
                    code: Str({ description: "Error code" }),
                    expected: Str({ description: "Expected value" }),
                    received: Str({ description: "Received value" }),
                    path: z.array(Str({ description: "Path to the error" })),
                    message: Str({ description: "Error message" }),
                  })
                  .strict()
              ),
              success: Bool({ description: "Success status" }),
            }),
          },
        },
      },
      "409": {
        description: "Returns a conflict message",
        content: {
          "application/json": {
            schema: z.object({
              message: Str({
                description: "Error message",
                example: "Job already in use",
              }),
            }),
          },
        },
      },
      "500": {
        description: "Returns an error message",
        content: {
          "application/json": {
            schema: z.object({
              message: Str({
                description: "Error message",
                example: "Something went wrong",
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    const jobRepository = new JobRepository(c.env.DB);

    try {
      const result = await jobRepository.createJob(data.body);
      c.status(201);
      return c.json(result);
    } catch (error) {
      if (error instanceof ConflictError) {
        c.status(error.statusCode);
        return c.json({ message: error.message });
      } else {
        c.status(500);
        return c.json({ message: "Something went wrong" });
      }
    }
  }
}
