import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

import { type AppContext, CreateJobSchema, JobSchema } from "@/common/types";
import { JobRepository } from "@/repository/jobRepository";
import { NotFoundError } from "@/common/errors";

const UpdateJobSchema = CreateJobSchema.partial();

export class JobUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Jobs"],
    summary: "Update an existing Job",
    request: {
      params: z.object({
        id: Num({ description: "Job ID" }),
      }),
      body: {
        content: {
          "application/json": {
            schema: UpdateJobSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the updated job",
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
      "404": {
        description: "Returns not found message",
        content: {
          "application/json": {
            schema: z.object({
              message: Str({
                description: "Error message",
                example: "Job not found",
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
      const updatedJob = await jobRepository.updateJob(
        data.params.id,
        data.body
      );
      return c.json(updatedJob);
    } catch (error) {
      if (error instanceof NotFoundError) {
        c.status(error.statusCode);
        return c.json({ message: error.message });
      } else {
        c.status(500);
        return c.json({ message: "Something went wrong" });
      }
    }
  }
}
