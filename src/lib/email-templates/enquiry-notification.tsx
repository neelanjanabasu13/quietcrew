import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface EnquiryNotificationProps {
  name?: string
  company?: string
  email?: string
  companySize?: string
  systems?: string
  manualWork?: string
}

const rowLabel = { color: '#6B6880', fontSize: '13px', fontWeight: 600, margin: '16px 0 2px' }
const rowValue = { color: '#1A1633', fontSize: '16px', lineHeight: 1.5, margin: 0 }

export function EnquiryNotification({
  name = '',
  company = '',
  email = '',
  companySize = '',
  systems = '',
  manualWork = '',
}: EnquiryNotificationProps) {
  return (
    <Html lang="en-GB">
      <Head />
      <Preview>New Workflow Review enquiry</Preview>
      <Body style={{ backgroundColor: '#FAF5EF', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', maxWidth: '560px', padding: '40px' }}>
          <Heading style={{ color: '#1A1633', fontSize: '22px', margin: 0 }}>
            New Workflow Review enquiry
          </Heading>
          <Text style={rowLabel}>Name</Text>
          <Text style={rowValue}>{name}</Text>
          <Text style={rowLabel}>Company</Text>
          <Text style={rowValue}>{company}</Text>
          <Text style={rowLabel}>Email</Text>
          <Text style={rowValue}>{email}</Text>
          <Text style={rowLabel}>Company size</Text>
          <Text style={rowValue}>{companySize}</Text>
          <Text style={rowLabel}>Systems</Text>
          <Text style={rowValue}>{systems || 'Not given'}</Text>
          <Text style={rowLabel}>Still manual</Text>
          <Text style={rowValue}>{manualWork || 'Not given'}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: EnquiryNotification,
  subject: (data) => `New enquiry: ${data['company'] || 'Workflow Review'}`,
  displayName: 'Enquiry notification (internal)',
  to: 'hello@quietcrew.ai',
  previewData: {
    name: 'Rachel Okonjo',
    company: 'Harlow Recruitment',
    email: 'rachel@harlowrecruitment.co.uk',
    companySize: '25-49',
    systems: 'Bullhorn, Outlook, Xero',
    manualWork: 'Retyping CV fields into the CRM and chasing timesheet approvals.',
  },
} satisfies TemplateEntry
