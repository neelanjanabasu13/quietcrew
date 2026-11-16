import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface OrderConfirmationProps {
  product?: string
  amount?: string
  link?: string
}

export function OrderConfirmation({ product = 'your Quietcrew order', amount = '', link = 'https://quietcrew.ai' }: OrderConfirmationProps) {
  return (
    <Html lang="en-GB">
      <Head />
      <Preview>{`Your ${product} order is confirmed.`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ backgroundColor: '#FAF5EF', borderRadius: '20px', maxWidth: '560px', padding: '40px' }}>
          <Text style={{ color: '#6B4EF5', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>Quietcrew</Text>
          <Heading style={{ color: '#1A1633', fontSize: '26px', lineHeight: 1.2, margin: '16px 0 0' }}>Your order is confirmed.</Heading>
          <Text style={{ color: '#1A1633', fontSize: '16px', lineHeight: 1.6 }}>
            Thank you for buying {product}{amount ? `, and the total charged was ${amount}` : ''}. Your results are ready whenever you want them, and you can open them again from the link below while signed in to the same account.
          </Text>
          <Button href={link} style={{ backgroundColor: '#3A1E9E', borderRadius: '999px', color: '#ffffff', fontSize: '15px', fontWeight: 600, padding: '14px 24px' }}>Open your results</Button>
          <Text style={{ color: '#6B6880', fontSize: '14px', lineHeight: 1.6, marginTop: '24px' }}>
            If anything does not look right, reply to hello@quietcrew.ai and we will help.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderConfirmation,
  subject: (data: Record<string, any>) => `Your ${data['product'] ?? 'Quietcrew'} order is confirmed`,
  displayName: 'Order confirmation',
  previewData: { product: 'a Goldmine scan', amount: '£49.00', link: 'https://quietcrew.ai/goldmine' },
} satisfies TemplateEntry
