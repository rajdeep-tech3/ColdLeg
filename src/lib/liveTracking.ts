// Shared live truck position, stored in localStorage so the driver portal
// can write it and the farmer portal can read it (same browser, any tab).

export interface LivePosition {
    requestId: string;
    lat: number;
    lng: number;
    progress: number; // 0 - 100
    updatedAt: number;
  }
  
  const KEY = 'kcc_live';
  
  function readAll(): Record<string, LivePosition> {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Record<string, LivePosition>) : {};
    } catch {
      return {};
    }
  }
  
  export function setLivePosition(pos: LivePosition): void {
    try {
      const all = readAll();
      all[pos.requestId] = pos;
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      // storage unavailable
    }
  }
  
  export function getLivePosition(requestId: string): LivePosition | null {
    return readAll()[requestId] ?? null;
  }
  
  export function clearLivePosition(requestId: string): void {
    try {
      const all = readAll();
      delete all[requestId];
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      // storage unavailable
    }
  }