export interface MoxfieldCard {
  card: {
    name: string;
    scryfall_id: string;
    image_uris?: { normal?: string; small?: string };
    card_faces?: Array<{ image_uris?: { normal?: string; small?: string } }>;
    mana_cost?: string;
    type_line?: string;
    prices?: {
      usd?: string;
      usd_foil?: string;
      eur?: string;
    };
  };
  quantity: number;
  price?: number;
}

export interface MoxfieldDeckResponse {
  id: string;
  name: string;
  publicUrl: string;
  format?: string;
  mainboard: Record<string, MoxfieldCard>;
  sideboard: Record<string, MoxfieldCard>;
}
