import { fromHono } from "chanfana";
import { Hono } from "hono";

import { JobCreate } from "@/endpoints/jobs/jobCreate";
import { JobDelete } from "@/endpoints/jobs/jobDelete";
import { JobFetch } from "@/endpoints/jobs/jobFetch";
import { JobList } from "@/endpoints/jobs/jobList";
import { JobUpdate } from "@/endpoints/jobs/jobUpdate";

export const job = fromHono(new Hono(), {});

job.get("", JobList);
job.post("", JobCreate);
job.get("/:id", JobFetch);
job.patch("/:id", JobUpdate);
job.delete("/:id", JobDelete);
