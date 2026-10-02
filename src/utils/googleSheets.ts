import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../config/firebase.ts';
import type { RsvpEntry } from '../types/party';

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google sign-in.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Create a new Google Sheet directly via Google Sheets API
export const createPartySpreadsheet = async (accessToken: string) => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'House Party 2026 - Nirav Patel (RSVPs)',
      },
      sheets: [
        {
          properties: {
            title: 'Guest List',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to create spreadsheet in Google Sheets');
  }

  const sheetData = await response.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // Add header row with nice styling
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Guest List'!A1:H1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [
          [
            'Timestamp',
            'Dallas Time',
            'Guest Name',
            'Phone Number',
            'RSVP Status',
            'Additional Guests',
            'Guest Names',
            'Notes',
          ],
        ],
      }),
    }
  );

  return {
    spreadsheetId,
    spreadsheetUrl: sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
};

// Append a single RSVP entry into Google Sheet
export const appendRsvpToSheet = async (
  spreadsheetId: string,
  entry: {
    timestamp: string;
    submittedAtFormatted: string;
    name: string;
    phone: string;
    status: string;
    additionalGuestsCount: number;
    additionalGuestNames: string[];
    notes?: string;
  },
  accessToken: string
) => {
  const range = `'Guest List'!A:H`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [
          [
            entry.timestamp,
            entry.submittedAtFormatted,
            entry.name,
            entry.phone,
            entry.status,
            entry.additionalGuestsCount,
            entry.additionalGuestNames.join(', '),
            entry.notes || '',
          ],
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to append RSVP to Google Sheet');
  }

  return response.json();
};

// Sync multiple RSVPs into Google Sheet
export const syncAllRsvpsToSheet = async (
  spreadsheetId: string,
  rsvps: any[],
  accessToken: string
) => {
  const range = `'Guest List'!A:H`;
  const values = rsvps.map((entry) => [
    entry.timestamp,
    entry.submittedAtFormatted,
    entry.name,
    entry.phone || '',
    entry.status,
    entry.additionalGuestsCount,
    (entry.additionalGuestNames || []).join(', '),
    entry.notes || '',
  ]);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to sync RSVPs to Google Sheet');
  }

  return response.json();
};
