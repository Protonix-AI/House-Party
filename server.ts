import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent RSVP storage path
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const rsvpFilePath = path.join(dataDir, 'rsvps.json');
const sheetConfigPath = path.join(dataDir, 'sheet-config.json');

export interface ConnectedSheetConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  accountEmail?: string;
  connectedAt: string;
}

function getStoredSheetConfig(): ConnectedSheetConfig | null {
  try {
    if (fs.existsSync(sheetConfigPath)) {
      return JSON.parse(fs.readFileSync(sheetConfigPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading sheet-config.json:', err);
  }
  return null;
}

function saveSheetConfig(config: ConnectedSheetConfig | null) {
  try {
    if (config) {
      fs.writeFileSync(sheetConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    } else if (fs.existsSync(sheetConfigPath)) {
      fs.unlinkSync(sheetConfigPath);
    }
  } catch (err) {
    console.error('Error saving sheet-config.json:', err);
  }
}

let currentSheetConfig: ConnectedSheetConfig | null = getStoredSheetConfig();

export interface RsvpEntry {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  status: 'YES' | 'MAYBE' | 'NO';
  additionalGuestsCount: number;
  additionalGuestNames: string[];
  notes?: string;
  submittedAtFormatted: string;
}

// Initial seed if file doesn't exist
function getStoredRsvps(): RsvpEntry[] {
  try {
    if (fs.existsSync(rsvpFilePath)) {
      const data = fs.readFileSync(rsvpFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading rsvps.json:', err);
  }
  return [
    {
      id: 'seed-1',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      name: 'Nirav Patel (Host)',
      phone: '469-555-0199',
      status: 'YES',
      additionalGuestsCount: 0,
      additionalGuestNames: [],
      notes: 'Let the madness begin! 🍻',
      submittedAtFormatted: 'Oct 2, 2026, 3:30 PM CDT'
    },
    {
      id: 'seed-2',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      name: 'Rohan Sharma',
      phone: '214-555-4821',
      status: 'YES',
      additionalGuestsCount: 1,
      additionalGuestNames: ['Priya V.'],
      notes: 'Bringing tequila and good playlist recommendations.',
      submittedAtFormatted: 'Oct 2, 2026, 6:30 PM CDT'
    }
  ];
}

function saveRsvps(rsvps: RsvpEntry[]) {
  try {
    fs.writeFileSync(rsvpFilePath, JSON.stringify(rsvps, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving rsvps.json:', err);
  }
}

// In-memory + persisted cache
let rsvpsList: RsvpEntry[] = getStoredRsvps();

// Optional Google Sheets Webhook forwarder
async function forwardToGoogleSheets(entry: RsvpEntry) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { forwarded: false, reason: 'No GOOGLE_SHEETS_WEBHOOK_URL set' };
  }

  try {
    const payload = {
      timestamp: entry.timestamp,
      formattedTime: entry.submittedAtFormatted,
      guestName: entry.name,
      phoneNumber: entry.phone,
      rsvpStatus: entry.status,
      additionalGuestsCount: entry.additionalGuestsCount,
      additionalGuestNames: entry.additionalGuestNames.join(', '),
      notes: entry.notes || '',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return { forwarded: response.ok, status: response.status };
  } catch (err: any) {
    console.warn('Google Sheets forward error (non-fatal):', err.message);
    return { forwarded: false, error: err.message };
  }
}

// RSVP submission endpoint
app.post('/api/rsvp', async (req: Request, res: Response) => {
  try {
    const { name, phone, status, additionalGuestsCount, additionalGuestNames, notes } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    if (!['YES', 'MAYBE', 'NO'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Valid RSVP status is required.' });
    }

    const count = Math.max(0, parseInt(additionalGuestsCount, 10) || 0);
    const guestNames: string[] = Array.isArray(additionalGuestNames)
      ? additionalGuestNames.slice(0, count).map(n => String(n).trim()).filter(Boolean)
      : [];

    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' CDT';

    const newEntry: RsvpEntry = {
      id: 'rsvp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: now.toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      status: status as 'YES' | 'MAYBE' | 'NO',
      additionalGuestsCount: count,
      additionalGuestNames: guestNames,
      notes: notes ? String(notes).trim() : '',
      submittedAtFormatted: formatted,
    };

    // Prepend to list
    rsvpsList.unshift(newEntry);
    saveRsvps(rsvpsList);

    // Forward asynchronously to Google Sheets if configured
    const sheetsResult = await forwardToGoogleSheets(newEntry);

    return res.status(200).json({
      success: true,
      message: status === 'NO' ? "We'll pretend we didn't see that. 😭" : "YOU'RE ON THE LIST. 🎉",
      entry: newEntry,
      sheetsForwarded: sheetsResult.forwarded,
    });
  } catch (error: any) {
    console.error('RSVP API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error processing RSVP' });
  }
});

// Get RSVPs & stats endpoint
app.get('/api/rsvps', (req: Request, res: Response) => {
  const pin = req.query.pin;
  const isHost = pin === (process.env.HOST_SECRET_PIN || '1916');

  const stats = {
    totalResponses: rsvpsList.length,
    yesCount: rsvpsList.filter(r => r.status === 'YES').length,
    maybeCount: rsvpsList.filter(r => r.status === 'MAYBE').length,
    noCount: rsvpsList.filter(r => r.status === 'NO').length,
    totalGuestsAttending: rsvpsList
      .filter(r => r.status === 'YES')
      .reduce((acc, curr) => acc + 1 + curr.additionalGuestsCount, 0),
  };

  // If host entered PIN, return full details including phone numbers
  if (isHost) {
    return res.json({ success: true, stats, isHost: true, rsvps: rsvpsList });
  }

  // Otherwise return public safe list (masked phone, guest names for social vibe)
  const publicList = rsvpsList.map(r => ({
    id: r.id,
    name: r.name,
    status: r.status,
    additionalGuestsCount: r.additionalGuestsCount,
    submittedAtFormatted: r.submittedAtFormatted,
    notes: r.notes,
  }));

  return res.json({ success: true, stats, isHost: false, rsvps: publicList });
});

// CSV Export for the host
app.get('/api/export-csv', (_req: Request, res: Response) => {
  const headers = ['Timestamp', 'Full Name', 'Phone Number', 'RSVP Status', 'Additional Guests', 'Guest Names', 'Notes'];
  const rows = rsvpsList.map(r => [
    `"${r.submittedAtFormatted}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.phone.replace(/"/g, '""')}"`,
    `"${r.status}"`,
    r.additionalGuestsCount,
    `"${r.additionalGuestNames.join(', ').replace(/"/g, '""')}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="house-party-2026-rsvps.csv"');
  return res.status(200).send(csvContent);
});

// Google Sheets configuration status & setup script helper
app.get('/api/google-sheets-config', (_req: Request, res: Response) => {
  const isConfigured = Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_WEBHOOK_URL.startsWith('http'));
  
  const sampleAppsScript = `// Google Apps Script code to connect this RSVP form to your Google Sheet:
// 1. In your Google Sheet, click Extensions > Apps Script
// 2. Replace the code with this script:
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Create headers if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Formatted Time", "Guest Name", "Phone Number", "RSVP Status", "Additional Guests", "Guest Names", "Notes"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#3b0764").setFontColor("#ffffff");
  }
  
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.formattedTime || "",
    data.guestName || "",
    data.phoneNumber || "",
    data.rsvpStatus || "",
    data.additionalGuestsCount || 0,
    data.additionalGuestNames || "",
    data.notes || ""
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 3. Click 'Deploy' > 'New deployment'
// 4. Select type: 'Web app'
// 5. Set 'Execute as': 'Me'
// 6. Set 'Who has access': 'Anyone'
// 7. Click Deploy, copy the Web App URL and add it to GOOGLE_SHEETS_WEBHOOK_URL!`;

  return res.json({
    configured: isConfigured || Boolean(currentSheetConfig),
    connectedSheet: currentSheetConfig,
    webhookUrlMasked: isConfigured
      ? process.env.GOOGLE_SHEETS_WEBHOOK_URL!.replace(/^(https:\/\/[^/]+\/).*$/, '$1...')
      : null,
    sampleScript: sampleAppsScript,
    hostPin: process.env.HOST_SECRET_PIN || '1916',
  });
});

// Connected Google Sheet endpoints
app.get('/api/connected-sheet', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    connectedSheet: currentSheetConfig,
  });
});

app.post('/api/connected-sheet', (req: Request, res: Response) => {
  const { spreadsheetId, spreadsheetUrl, accountEmail, disconnect } = req.body;

  if (disconnect) {
    currentSheetConfig = null;
    saveSheetConfig(null);
    return res.json({ success: true, message: 'Google Sheet disconnected' });
  }

  if (!spreadsheetId || !spreadsheetUrl) {
    return res.status(400).json({ success: false, error: 'spreadsheetId and spreadsheetUrl are required' });
  }

  currentSheetConfig = {
    spreadsheetId,
    spreadsheetUrl,
    accountEmail: accountEmail || '',
    connectedAt: new Date().toISOString(),
  };
  saveSheetConfig(currentSheetConfig);

  return res.json({
    success: true,
    message: 'Google Sheet linked successfully',
    connectedSheet: currentSheetConfig,
  });
});

// Start server with Vite middleware in dev or static in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
