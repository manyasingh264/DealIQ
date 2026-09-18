const { z } = require('zod');

const aiReportSchema = z.object({
  company: z.string().optional(),
  deal_size: z.string().optional(),
  outcome: z.string().optional(),
  primary_reason: z.string().default('other'),
  primary_explanation: z.string().default(''),
  secondary_reason: z.string().optional().default(''),
  in_our_control: z.array(z.string()).default([]),
  not_in_our_control: z.array(z.string()).default([]),
  competitors: z.array(z.string()).default([]),
  objections: z.array(z.string()).default([]),
  positive_signals: z.array(z.string()).default([]),
  coaching_note: z.string().default(''),
  strategic_insight: z.string().default(''),
  next_time: z.array(z.string()).default([]),
  what_worked: z.array(z.string()).default([])
}).passthrough();

const ms2ResponseSchema = z.object({
  success: z.boolean().default(true),
  report: aiReportSchema
});

module.exports = { aiReportSchema, ms2ResponseSchema };
