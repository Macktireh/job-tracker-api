# Job Tracker API

A Cloudflare Workers API for tracking job applications built with OpenAPI 3.1 using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono).

This API allows you to track your job applications with features to create, read, update, and delete job entries.

## Features

- RESTful API with full CRUD operations for job applications
- Automatic OpenAPI documentation generation
- Request validation using Zod schemas
- SQLite database storage using Cloudflare D1
- Error handling with appropriate HTTP status codes

## Tech Stack

- **Cloudflare Workers**: Serverless functions running on Cloudflare's global network
- **Hono**: Lightweight and fast web framework for Cloudflare Workers
- **Chanfana**: OpenAPI generator for Hono
- **SQLite/D1**: Database for storing job application data
- **Zod**: TypeScript-first schema validation

## API Endpoints

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| GET    | /api/jobs     | List all job applications      |
| POST   | /api/jobs     | Create a new job application   |
| GET    | /api/jobs/:id | Get a specific job application |
| PATCH  | /api/jobs/:id | Update a job application       |
| DELETE | /api/jobs/:id | Delete a job application       |

## Job Model

Each job entry contains:

- `url`: URL of the job posting (required)
- `title`: Job title (required)
- `description`: Job description (optional)
- `company`: Company name (required)
- `location`: Job location (optional)
- `logo`: Company logo URL (optional)
- `status`: Application status (one of: "applied", "in_progress", "offre", "rejected")
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (free tier is sufficient)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Macktireh/job-tracker-api.git
   cd job-tracker-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Login to your Cloudflare account:
   ```bash
   npx wrangler login
   ```

4. Create a D1 database:
   ```bash
   npx wrangler d1 create job-tracker
   ```

5. Take note of the database ID and update your `wrangler.json` file:
   ```json
   {
     "d1_databases": [
       {
         "binding": "DB",
         "database_name": "job-tracker",
         "database_id": "YOUR_DATABASE_ID"
       }
     ]
   }
   ```

### Development

1. Initialize the database schema locally:
   ```bash
   npx wrangler d1 execute job-tracker --local --file schemas/000_create_job_table.sql
   ```

2. Start a local development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:8787/` to see the Swagger UI where you can test the endpoints.

### Deployment

1. Initialize the database schema in production:
   ```bash
   npx wrangler d1 execute job-tracker --remote --file schemas/000_create_job_table.sql
   ```

2. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

## License

MIT

## Acknowledgments

This project is based on the [Cloudflare Workers OpenAPI 3.1](https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare/templates/openapi/ts) template.
