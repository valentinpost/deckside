export interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  type_line?: string;
  image_uris?: { normal?: string; small?: string };
  card_faces?: Array<{ image_uris?: { normal?: string; small?: string } }>;
}

export interface ScryfallCollectionResponse {
  data: ScryfallCard[];
  not_found: Array<{ id: string }>;
}
