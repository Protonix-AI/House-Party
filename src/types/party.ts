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

export interface ConnectedSheetConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  accountEmail?: string;
  connectedAt: string;
}

export interface PartyStats {
  totalResponses: number;
  yesCount: number;
  maybeCount: number;
  noCount: number;
  totalGuestsAttending: number;
}
