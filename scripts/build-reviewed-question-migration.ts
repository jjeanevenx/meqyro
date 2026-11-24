import fs from "node:fs";
import path from "node:path";
import { reviewedQuestionSeedSql, activateReviewedBanksSql } from "./reviewed-question-seed";

// Supabase CLI creates the filename first. Refuse to overwrite a previously generated migration.
const target = process.argv[2];
if (!target || !/^supabase\/migrations\/\d+_reviewed_question_banks\.sql$/.test(target)) {
  throw new Error("Pass the empty migration path created by supabase migration new");
}
if (fs.readFileSync(target, "utf8").trim()) throw new Error("Migration is not empty");
fs.writeFileSync(target, reviewedQuestionSeedSql());
fs.writeFileSync(
  path.resolve("docs/audits/activate-reviewed-question-banks.sql"),
  "-- Run only after deploying matching reviewed-question code. Atomic release; no historical question/answer/result changes.\nbegin;\n" +
    activateReviewedBanksSql() +
    "\ncommit;\n",
);
