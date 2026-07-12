import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type BasketItem = {
  id: string;
  serviceKey: string;
  title: string;
  details: {
    name: string;
    phone: string;
    email: string;
    requiredProduct: string;
    preferredColors: string;
    fontStyle: string;
    designNotes: string;
  };
};

type BasketContextType = {
  items: BasketItem[];
  addItem: (item: BasketItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  count: number;
};

const BasketContext = createContext<BasketContextType | null>(null);

const STORAGE_KEY = "wlsset-basket";

function loadFromStorage(): BasketItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let idCounter = Date.now();
function nextId(): string {
  return (++idCounter).toString(36);
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: BasketItem) => {
    setItems((prev) => [...prev, { ...item, id: nextId() }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.length;

  return (
    <BasketContext.Provider value={{ items, addItem, removeItem, clear, count }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used within BasketProvider");
  return ctx;
}
