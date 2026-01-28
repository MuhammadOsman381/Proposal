CREATE TABLE "proposal" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_key" text NOT NULL,
	"secret_key" text NOT NULL,
	"message" text NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
