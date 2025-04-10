import { Twilio } from 'twilio';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from .env file
dotenv.config();

interface MessageVariables {
  [key: string]: string;
}

export async function sendTemplateMessage(contentVariables: MessageVariables): Promise<string> {
  // Read from environment variables
  const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const SENDER = process.env.TWILIO_WHATSAPP_SENDER;
  const RECEIVER = process.env.TWILIO_WHATSAPP_RECEIVER;

  // Check if any variable is missing
  const missingVars = Object.entries({
    "TWILIO_ACCOUNT_SID": ACCOUNT_SID,
    "TWILIO_AUTH_TOKEN": AUTH_TOKEN,
    "TWILIO_WHATSAPP_SENDER": SENDER,
    "TWILIO_WHATSAPP_RECEIVER": RECEIVER
  })
    .filter(([_, value]) => value === undefined)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    const errorMsg = `❌ Error: Missing environment variables: ${missingVars.join(', ')}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Initialize Twilio client
  const client = new Twilio(ACCOUNT_SID as string, AUTH_TOKEN as string);

  // Convert contentVariables object to JSON string
  const contentVariablesJson = JSON.stringify(contentVariables);

  // Send message
  const message = await client.messages.create({
    from: SENDER as string,
    contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
    contentVariables: contentVariablesJson,
    to: RECEIVER as string
  });

  console.log(`Message sent with SID: ${message.sid}`);
  return message.sid;
}