-- ALTER TABLE "posts" ALTER COLUMN "published_at" SET DATA TYPE timestamp;--> statement-breakpoint
-- ALTER TABLE "posts" ALTER COLUMN "published_at" DROP NOT NULL;
ALTER TABLE "posts" DROP COLUMN "published_at";
ALTER TABLE "posts" ADD COLUMN "published_at" timestamp;