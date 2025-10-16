CREATE TYPE "public"."token_type" AS ENUM('ACTIVATION', 'RECOVERY', 'RESET', 'REFRESH');--> statement-breakpoint
CREATE TABLE "token" (
	"token" varchar,
	"username" varchar NOT NULL,
	"type" "token_type",
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "token" ADD CONSTRAINT "token_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;