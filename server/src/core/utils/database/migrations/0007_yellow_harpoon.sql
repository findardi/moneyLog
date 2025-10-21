CREATE TYPE "public"."period_limit" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');--> statement-breakpoint
CREATE TABLE "spending_limit" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"period" "period_limit" DEFAULT 'WEEKLY' NOT NULL,
	"amount" integer NOT NULL,
	"alert_percentage" integer DEFAULT 75 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "amount_idx";--> statement-breakpoint
DROP INDEX "user_id_idx";--> statement-breakpoint
DROP INDEX "category_id_idx";--> statement-breakpoint
ALTER TABLE "spending_limit" ADD CONSTRAINT "spending_limit_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "spending_limit_user_id_idx" ON "spending_limit" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "spending_limit_period_idx" ON "spending_limit" USING btree ("period");--> statement-breakpoint
CREATE INDEX "spending_limit_amount_idx" ON "spending_limit" USING btree ("amount");--> statement-breakpoint
CREATE INDEX "spending_limit_alert_percentage_idx" ON "spending_limit" USING btree ("alert_percentage");--> statement-breakpoint
CREATE INDEX "expense_amount_idx" ON "expenses" USING btree ("amount");--> statement-breakpoint
CREATE INDEX "expense_user_id_idx" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expense_category_id_idx" ON "expenses" USING btree ("category_id");