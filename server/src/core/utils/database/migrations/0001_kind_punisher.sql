CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" integer,
	"category_id" integer,
	"name" text NOT NULL,
	"amount" integer NOT NULL,
	"spent_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "spent_at_idx" ON "expenses" USING btree ("spent_at");--> statement-breakpoint
CREATE INDEX "expense_name_idx" ON "expenses" USING btree ("name");--> statement-breakpoint
CREATE INDEX "amount_idx" ON "expenses" USING btree ("amount");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "category_id_idx" ON "expenses" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "full_name_idx" ON "users" USING btree ("full_name");