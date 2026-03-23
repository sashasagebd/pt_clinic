import open from 'open'
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REDIRECT_PORT } from './credentials';
import { google } from 'googleapis';
import { saveTokens, loadTokens, deleteTokens } from './token-storage';
import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import type { Employee } from '../types/Employee';
import crypto from 'crypto';
import mime from 'mime-types';

const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
]

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

export async function logOut() {
    await deleteTokens();
}

export async function getCredentials() {
    const tokens = await loadTokens();
    if(tokens) {
        oauth2Client.setCredentials(tokens);
        return oauth2Client;
    }
    else {
        return await oauthLogin();
    }
}

async function oauthLogin() {
    return new Promise<any>((resolve, reject) => {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });

        open(authUrl);

        const server = http.createServer(async (req, res) => {
            try {
                const reqUrl = new URL(req.url || '', `http://127.0.0.1:${REDIRECT_PORT}`);
                const code = reqUrl.searchParams.get('code');

                if(code) {
                    res.end('Authentification successful, you can close this tab');
                    server.close();

                    const { tokens } = await oauth2Client.getToken(code);
                    oauth2Client.setCredentials(tokens);
                    await saveTokens(tokens);
                    resolve(oauth2Client)
                }
                else {
                    res.end('Unable to authenticate');
                }
            }
            catch(err) {
                reject(err);
            }
        });

        server.listen(REDIRECT_PORT);
    });
}


export async function sendEmail(employee: Employee) {
    try {
        const auth = await getCredentials();
        const gmail = google.gmail({
            version: 'v1',
            auth
        });

        const boundary = `mixed_${crypto.randomUUID()}`;
        const body = `${employee.name}, ${employee.type}`;
        const subject = `${employee.name}`
        const to = `${employee.email}`

        const attachments: string[] = [];

        const imgPaths: string[] = JSON.parse(employee.imgPath);

        for (const path of imgPaths) {
            const base64 = fs.readFileSync(path).toString("base64");
            const filename = path.split(/[\\/]/).pop();

            const mimeType = mime.lookup(path) || "application/octet-stream";

            attachments.push(
                `--${boundary}`,
                `Content-Type: ${mimeType}`,
                `Content-Transfer-Encoding: base64`,
                `Content-Disposition: attachment; filename="${filename}"`,
                ``,
                base64,
                ``
            );
        }

        const rawMessage = [
        `From: me`,
        `To: ${to}`,
        `Subject: Hour Sheets`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        '',
        body,
        '',
        ...attachments,
        `--${boundary}--`,
        ].join('\r\n');

        const encodedMessage = Buffer.from(rawMessage)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

        await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
        });

    } catch(err) {
        console.error(err);
    }
}