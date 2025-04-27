import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

import { type AppContext, JobSchema } from "@/common/types";
import { JobRepository } from "@/repository/jobRepository";

export class JobList extends OpenAPIRoute {
  schema = {
    tags: ["Jobs"],
    summary: "List Jobs",
    request: {},
    responses: {
      "200": {
        description: "Returns a list of jobs",
        content: {
          "application/json": {
            schema: z.object({
              jobs: JobSchema.array(),
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
    const jobRepository = new JobRepository(c.env.DB);
    try {
      const jobs = await jobRepository.getJobs();
      return c.json({ jobs });
    } catch (error) {
      c.status(500);
      return c.json({ message: "Something went wrong" });
    }
  }
}
