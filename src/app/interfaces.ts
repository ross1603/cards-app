export interface interfaceHome {
  id: number;
  front: string;
  back: string;
  total_cards: number,
  total_collections: number,
  total_users: number,
}

export interface interfaceCollections {
  id: number;
  user_id: number;
  is_public: number;
  front: string;
  back: string;
  name: string;
  collection_name: string;
}

export interface interfaceCard {
  id: number;
  front: string;
  back: string;
  is_public: number;
  collection_id: number;
  user_id: number;
  date: string;
  name: string;
  username: string;
}

export interface interfaceAccount {
  card_id: number;
  front: string;
  back: string;
}

export interface interfaceCollections {
  collection_id: number;
  name: string;
}

export interface interfaceMigrations {
  migration_id: number;
  id: number;
  front: string;
  back: string;
  is_public: number;
  collection_id: number;
  name: string;
}

export interface interfaceRecommended {
  id: number;
  name: string;
  count: number;
}

export interface interfaceAnalyticsSidebar {
  count: number,
  votes: string
}

export interface interfaceAnalyticsDashboard {
  card_id: number,
  card_name: string,
  collection_name: string,
  total_votes: number,
  total_positive_votes: number
}

export interface interfaceSearch {
  card_id: number,
  card_name: string,
  collection_id: number,
  collection_name: string,
}