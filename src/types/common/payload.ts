import { z } from "zod";
import { errorCommandsForFrontendToExecute } from "@src/types/index";

export const payload_schema = z
  .object({
    data: z.any(),
    msg: z.string().optional(),
    count: z.number().optional(),
    total_in_db: z.union([z.number().array(), z.number()]).optional(),
    // error: z.union([z.record(z.unknown()), z.boolean(), z.string()]).optional(),
    error: z.any().optional(),

    errorCommandForFrontendToExecute: z.enum(errorCommandsForFrontendToExecute).optional(),
    intersection_counts: z
      .array(
        z.object({
          _id: z.string(),
          count: z.number(),
        }),
      )
      .optional(),
    tagRanks: z
      .array(
        z.object({
          _id: z.string(),
          tagRank: z.number(),
        }),
      )
      .optional(),
  })
  .refine(
    (obj) => {
      if (!!obj.error && !obj.data) return false;
      else return false;
    },
    { message: "error is clear, but data doesnt exist" },
  );

export type Payload = z.infer<typeof payload_schema>;

// --------

export const pre_payload = z.object({
  payload: payload_schema,
  statuscode: z.number(),
  error: z.any().optional(),
});

export type Pre_Payload = z.infer<typeof pre_payload>;
