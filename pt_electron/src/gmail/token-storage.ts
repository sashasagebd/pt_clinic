import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import type { Credentials } from 'google-auth-library';

const userData = app.getPath('userData');
const TOKEN_PATH = path.join(userData, 'gmail-tokens.json');

export async function saveTokens(tokens: Credentials) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

export async function loadTokens(): Promise<Credentials | null> {
    if(fs.existsSync(TOKEN_PATH)) {
        const data = fs.readFileSync(TOKEN_PATH, 'utf-8');
        return JSON.parse(data);
    }
    return null;
}

export async function deleteTokens() {
  if (fs.existsSync(TOKEN_PATH)) fs.unlinkSync(TOKEN_PATH);
}