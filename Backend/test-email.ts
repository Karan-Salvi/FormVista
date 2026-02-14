import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log(
    'Testing Resend with API Key:',
    process.env.RESEND_API_KEY?.substring(0, 5) + '...'
  );
  console.log('From Email:', process.env.RESEND_FROM_EMAIL);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: 'portfolio.karansalvi@gmail.com',
      subject: 'Test Email from FormVista',
      html: '<p>If you see this, Resend is working!</p>',
    });

    if (error) {
      console.error('Resend Error:', error);
    } else {
      console.log('Resend Success:', data);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

testResend();
