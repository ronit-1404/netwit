import { z } from "zod";

export const leadSchema = z.object({
  customer_id: z.string().uuid().optional(),
  source: z.enum(["Craigslist", "Kijiji", "Text Us", "Website", "Referral", "Other"]),
  status: z.enum(["Not Started", "In Progress", "Qualified", "Closed", "Lost"]).default("Not Started"),
  interest_vehicle_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export interface Lead {
  id: string;
  customer_id: string | null;
  source: string;
  status: string;
  interest_vehicle_id: string | null;
  assigned_to: string | null;
  notes: string | null;
  lead_creation_date: string;
  last_engagement: string;
  created_at: string;
  updated_at: string;
}
