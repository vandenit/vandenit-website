'use server';
const postmark = require("postmark");
import { promises as fs } from 'fs';
import path from 'path';

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

export async function createAuditRequest(formData) {
  try {
    const email = formData.get('email');
    const website = formData.get('website');
    const htmlBody = await readFileContent('thank-you.html');
    const textBody = await readFileContent('thank-you.txt');

    const data = {
      email: formData.get('email'),
      website: formData.get('website'),
      feedBack: formData.get('feedBack')
    };
    // Process the data (save to DB, send email, etc.)
    console.log('Received new security audit request:', JSON.stringify(data));

    // send thank you to the user
    client.sendEmail({
      "From": "filip@vandenit.be",
      "To": email,
      "Subject": "Thank you for your request",
      "HtmlBody": htmlBody,
      "TextBody": textBody,
      "MessageStream": "notifications"
    });

    // send confirmation to myself
    client.sendEmail({
      "From": "filip@vandenit.be",
      "To": "filip@vandenit.be",
      "Subject": "New security audit request",
      "TextBody": `New security audit request with data: ${JSON.stringify(data)}`,
      "MessageStream": "notifications"
    });
    return { success: true };
  } catch (error) {
    console.error('Error processing the form:', error);
    return { success: false };
  }
}

const readFileContent = async (fileName: string) => {
  const filePath = path.resolve(process.cwd(), 'app/forms/request-security-audit/actions', fileName);

  // Read the HTML file contents
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}