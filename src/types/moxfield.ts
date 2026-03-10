export interface MoxfieldCard {
  card: {
    name: string;
    scryfall_id: string;
    image_uris?: { normal?: string; small?: string };
    card_faces?: Array<{ image_uris?: { normal?: string; small?: string } }>;
    mana_cost?: string;
    type_line?: string;
  };
  quantity: number;
}

export interface MoxfieldDeckResponse {
  id: string;
  name: string;
  publicUrl: string;
  mainboard: Record<string, MoxfieldCard>;
  sideboard: Record<string, MoxfieldCard>;
}
