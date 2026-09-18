const { z } = require('zod');

const createDealSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  deal_size: z.string().min(1, 'Deal size is required'),
  outcome: z.enum(['WON', 'LOST'], 'Outcome must be WON or LOST'),
  deal_text: z.string().min(1, 'Deal text is required'),
  primary_reason: z.string().optional(),
  report: z.object({
    competitors: z.array(z.string()).optional(),
    objections: z.array(z.string()).optional(),
    positive_signals: z.array(z.string()).optional(),
    coaching_note: z.string().optional(),
    strategic_insight: z.string().optional(),
    next_time: z.array(z.string()).optional(),
    what_worked: z.array(z.string()).optional(),
    primary_explanation: z.string().optional()
  }).optional(),
  deal_name: z.string().optional()
});

module.exports = { createDealSchema };
