const fs = require('fs');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Load credentials from client_secret.json file
const credentialsPath = './client_secret.json';
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

// Create OAuth2 client
const client = new OAuth2Client(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

// Example function to fetch unread emails
async function fetchUnreadEmails() {
  try {
    // Authorize client
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly']
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    // Get authorization code and exchange for token
    const code = 'Paste the code from the authorization page here';
    const token = await client.getToken(code);
    client.setCredentials(token.tokens);

    // Use Gmail API to fetch unread emails
    const gmail = google.gmail({ version: 'v1', auth: client });
    const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });
    const messages = res.data.messages;

    if (messages) {
      for (const message of messages) {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        console.log('Email:', email.data);
      }
    } else {
      console.log('No unread emails found.');
    }
  } catch (error) {
    console.error('Error fetching unread emails:', error);
  }
}

fetchUnreadEmails();
