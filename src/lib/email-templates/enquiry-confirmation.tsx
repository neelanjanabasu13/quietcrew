import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface EnquiryConfirmationProps {
  name?: string
  manualWork?: string
}

export function EnquiryConfirmation({
  name = 'there',
  manualWork = '',
}: EnquiryConfirmationProps) {
  return (
    <Html lang="en-GB">
      <Head />
      <Preview>We have your enquiry and will reply within one working day.</Preview>
      <Body style={{ backgroundColor: '#FAF5EF', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', maxWidth: '560px', padding: '40px' }}>
          <Text style={{ color: '#6B4EF5', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>
            Quietcrew
          </Text>
          <Heading style={{ color: '#1A1633', fontSize: '26px', lineHeight: 1.2, margin: '16px 0 0' }}>
            Thanks {name}, we have your enquiry.
          </Heading>
          <Text style={{ color: '#6B6880', fontSize: '16px', lineHeight: 1.6 }}>
            We will read it properly and reply within one working day with an honest view:
            whether one of our ready-made tools already covers it, whether the £99 workflow
            audit is the right next step, or whether you do not need us at all.
          </Text>
          {manualWork ? (
            <Section style={{ backgroundColor: '#EFEBFF', borderRadius: '14px', marginTop: '8px', padding: '18px 20px' }}>
              <Text style={{ color: '#1A1633', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                What you told us is still manual
              </Text>
              <Text style={{ color: '#1A1633', fontSize: '15px', lineHeight: 1.6, margin: '8px 0 0' }}>
                {manualWork}
              </Text>
            </Section>
          ) : null}
          <Text style={{ color: '#6B6880', fontSize: '16px', lineHeight: 1.6 }}>
            If it looks like a fit, we will explain what the work involves, roughly what
            it would cost, and whether it is worth doing at all. If you would like to add
            anything before then, reply to this email.
          </Text>
          <Text style={{ color: '#6B6880', fontSize: '14px', lineHeight: 1.6, marginTop: '28px' }}>
            Quietcrew. The work gets done in the background.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: EnquiryConfirmation,
  subject: 'We have your enquiry, Quietcrew',
  displayName: 'Enquiry confirmation',
  previewData: {
    name: 'Rachel',
    manualWork: 'Retyping CV fields from email attachments into our CRM every morning.',
  },
} satisfies TemplateEntry
