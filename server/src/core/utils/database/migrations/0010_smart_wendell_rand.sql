CREATE TABLE "periode_limit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"spending_limit_id" uuid NOT NULL,
	"periode_start" timestamp NOT NULL,
	"periode_end" timestamp NOT NULL,
	"current_spending" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_spending_limit" UNIQUE("user_id","spending_limit_id")
);
--> statement-breakpoint
ALTER TABLE "spending_limit" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "periode_limit" ADD CONSTRAINT "periode_limit_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "periode_limit" ADD CONSTRAINT "periode_limit_spending_limit_id_spending_limit_id_fk" FOREIGN KEY ("spending_limit_id") REFERENCES "public"."spending_limit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "periode_limit_user_id_idx" ON "periode_limit" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "periode_limit_spending_limit_id_idx" ON "periode_limit" USING btree ("spending_limit_id");--> statement-breakpoint
CREATE INDEX "periode_limit_periode_start_idx" ON "periode_limit" USING btree ("periode_start");--> statement-breakpoint
CREATE INDEX "periode_limit_periode_end_idx" ON "periode_limit" USING btree ("periode_end");