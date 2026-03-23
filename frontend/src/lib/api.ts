const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface Document {
  id: string;
  doc_type: string;
  ipfs_hash: string;
  storage_url: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  milestone: 'farm' | 'warehouse' | 'port' | 'importer';
  notes: string | null;
  recorded_at: string;
}

export interface TradeDeal {
  id: string;
  commodity: string;
  quantity: number;
  quantity_unit: string;
  total_value: number;
  total_invested: number;
  token_symbol: string;
  status: 'draft' | 'open' | 'funded' | 'delivered' | 'completed' | 'failed';
  delivery_date: string;
  created_at: string;
  documents?: Document[];
  milestones?: Milestone[];
}

export async function getOpenDeals(): Promise<TradeDeal[]> {
  const res = await fetch(`${API_BASE}/trade-deals`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch deals');
  return res.json();
}

export async function getDealById(id: string): Promise<TradeDeal | null> {
  const res = await fetch(`${API_BASE}/trade-deals/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch deal');
  return res.json();
}
