export interface interfaceHome {
  id: number;
  front: string;
  back: string;
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
  id: number;
  name: string,
  card_id: number,
  front: string;
  back: string;
  is_public: number;
  collection_id: number;
  user_id: number;
  migration_id: number;
}

export interface interfaceUnique {
  id: number;
  name: string;
}

export interface interfaceMigrations {
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