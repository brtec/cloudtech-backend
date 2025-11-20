-- Add OWNER value to Role enum if it doesn't exist
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_enum e
		JOIN pg_type t ON e.enumtypid = t.oid
		WHERE t.typname = 'Role' AND e.enumlabel = 'OWNER'
	) THEN
		ALTER TYPE "Role" ADD VALUE 'OWNER';
	END IF;
END$$;

-- Add activeCompanyId column to User if not exists
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_name = 'User' AND column_name = 'activeCompanyId'
	) THEN
		ALTER TABLE "User" ADD COLUMN "activeCompanyId" TEXT;
	END IF;
END$$;

-- Add foreign key constraint for activeCompanyId if not exists
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.table_constraints tc
		JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
		WHERE tc.table_name = 'User' AND tc.constraint_type = 'FOREIGN KEY' AND kcu.column_name = 'activeCompanyId'
	) THEN
		ALTER TABLE "User" ADD CONSTRAINT "User_activeCompanyId_fkey" FOREIGN KEY ("activeCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
	END IF;
END$$;
