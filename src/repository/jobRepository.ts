import { CreateJobType, JobType, type AppContext } from "@/common/types";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/common/errors";

export class JobRepository {
  constructor(private readonly db: AppContext["env"]["DB"]) {}

  public async createJob(jobToCreate: CreateJobType): Promise<JobType> {
    if (await this.existsByUrl(jobToCreate.url)) {
      throw new ConflictError("Job already exists with this URL");
    }

    const { success, results } = await this.db
      .prepare(
        `
        INSERT INTO jobs (url, title, description, company, location, logo, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id, url, title, description, company, location, logo, status, createdAt, updatedAt
      `
      )
      .bind(
        jobToCreate.url,
        jobToCreate.title,
        jobToCreate.description,
        jobToCreate.company,
        jobToCreate.location,
        jobToCreate.logo,
        jobToCreate.status
      )
      .run();

    if (!success || results.length === 0) {
      throw new InternalServerError("Failed to create job");
    }

    return results[0] as JobType;
  }

  public async getJobs(): Promise<JobType[]> {
    const { results } = await this.db.prepare(`SELECT * FROM jobs`).all();
    return results as JobType[];
  }

  public async getJobById(id: number): Promise<JobType> {
    const job = await this.findOne(`SELECT * FROM jobs WHERE id = ?`, id);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    return job;
  }

  public async getJobByUrl(url: string): Promise<JobType | null> {
    return await this.findOne(`SELECT * FROM jobs WHERE url = ?`, url);
  }

  public async updateJob(id: number, data: Partial<CreateJobType>): Promise<JobType> {
    const job = await this.getJobById(id);

    if (Object.keys(data).length === 0) {
      return job;
    }

    const fields = Object.keys(data);
    const values = Object.values(data);

    const setClause = fields.map((field) => `${field} = ?`).join(", ");

    const { success } = await this.db
      .prepare(
        `UPDATE jobs SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`
      )
      .bind(...values, id)
      .run();

    if (!success) {
      throw new InternalServerError("Failed to update job");
    }

    return this.getJobById(id);
  }

  public async deleteJob(id: number): Promise<void> {
    await this.getJobById(id);
    await this.db.prepare(`DELETE FROM jobs WHERE id = ?`).bind(id).run();
  }

  private async existsByUrl(url: string): Promise<boolean> {
    const job = await this.getJobByUrl(url);
    return !!job;
  }

  private async findOne(
    query: string,
    param: string | number
  ): Promise<JobType | null> {
    const { results } = await this.db.prepare(query).bind(param).all();
    return results.length > 0 && results[0].id ? (results[0] as JobType) : null;
  }
}
