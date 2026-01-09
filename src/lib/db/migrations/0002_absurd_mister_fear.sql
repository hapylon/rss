CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" text,
	"url" text NOT NULL,
	"description" text,
	"published_at" text NOT NULL,
	"feed_id" uuid NOT NULL,
	CONSTRAINT "posts_url_unique" UNIQUE("url")
);
