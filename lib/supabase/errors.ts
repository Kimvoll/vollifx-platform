export function isSchemaCacheError(error: unknown) {
  const message = error instanceof Error ? error.message : String((error as any)?.message || error || "");
  return message.includes("schema cache") || message.includes("Could not find the") || message.includes("column");
}

export function schemaMigrationMessage() {
  return "Database needs the payment-system migration. Run supabase/payment-system-migration.sql in Supabase SQL Editor, then retry.";
}
