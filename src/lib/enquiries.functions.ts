import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(200),
  companySize: z.string().trim().min(1).max(20),
  systems: z.string().trim().max(500).optional(),
  manualWork: z.string().trim().max(2000).optional(),
})

export const submitEnquiry = createServerFn({ method: 'POST' })
  .validator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { submitEnquiryImpl } = await import('./enquiries.server')
    return submitEnquiryImpl(data)
  })
