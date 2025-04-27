import { Num, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

import { type AppContext } from "@/common/types";
import { JobRepository } from "@/repository/jobRepository";
import { NotFoundError } from "@/common/errors";

export class JobDelete extends OpenAPIRoute {
  schema = {
    tags: ["Jobs"],
    summary: "Delete a Job",
    request: {
      params: z.object({
        id: Num({ description: "Job id" }),
      }),
    },
    responses: {
      "200": {
        description: "Returns a success message",
        content: {
          "application/json": {
            schema: z.object({
              message: Str({
                description: "Message",
                example: "Job deleted successfully",
              }),
            }),
          },
        },
      },
      "404": {
        description: "Returns a not found message",
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
      await jobRepository.deleteJob(data.params.id);
      c.status(200);
      return c.json({ message: "Job deleted successfully" });
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
