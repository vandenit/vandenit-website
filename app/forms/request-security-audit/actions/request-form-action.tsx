'use server';
const postmark = require("postmark");
import path from 'path';

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

export async function createAuditRequest(formData) {
  try {
    const data = {
      email: formData.get('email'),
      website: formData.get('website'),
      feedBack: formData.get('feedBack'),
      name: formData.get('name'),
    };
    // Process the data (save to DB, send email, etc.)
    console.log('Received new security audit request:', JSON.stringify(data));

    // send thank you to the user
    client.sendEmailWithTemplate(
      {
        "From": "filip@vandenit.be",
        "To": data.email,
        "MessageStream": "notifications",
        "TemplateAlias": "security-audit-thank-you",
        "TemplateModel": {
          "name": data.name || "Customer"
        }
      }
    );
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