import { z } from "zod";

export const RecordSchema = z.record(z.string(), z.string());
