import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { sendTemplateEmail } from './email-templates/send-email'

export interface EnquiryInput {
  name: string
  company: string
  email: string
  companySize: string
  systems?: string | undefined
  manualWork?: string | undefined
}

export async function submitEnquiryImpl(input: EnquiryInput) {
  const { data, error } = await supabaseAdmin
    .from('enquiries')
    .insert({
      name: input.name,
      company: input.company,
      email: input.email,
      company_size: input.companySize,
      systems: input.systems || null,
      manual_work: input.manualWork || null,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[enquiries] insert failed', error)
    throw new Error('Could not save the enquiry')
  }

  // Emails are best effort: a failed send must not lose the enquiry.
  try {
    await sendTemplateEmail('enquiry-confirmation', input.email, {
      templateData: { name: input.name, manualWork: input.manualWork ?? '' },
      idempotencyKey: `enquiry-confirmation-${data.id}`,
    })
  } catch (err) {
    console.error('[enquiries] confirmation email failed', err)
  }

  try {
    await sendTemplateEmail('enquiry-notification', 'hello@quietcrew.ai', {
      templateData: {
        name: input.name,
        company: input.company,
        email: input.email,
        companySize: input.companySize,
        systems: input.systems ?? '',
        manualWork: input.manualWork ?? '',
      },
      idempotencyKey: `enquiry-notification-${data.id}`,
    })
  } catch (err) {
    console.error('[enquiries] notification email failed', err)
  }

  return { id: data.id }
}
