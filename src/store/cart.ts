import { create } from 'zustand';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
    shippingCost?: number;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        const newItems = existing
            ? items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...items, { ...product, quantity: 1 }];
        const total = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
        set({ items: newItems, totalPrice: total, totalItems: newItems.reduce((s, i) => s + i.quantity, 0) });
    },
    removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.id !== productId);
        set({ items: newItems, totalPrice: newItems.reduce((s, i) => s + i.price * i.quantity, 0), totalItems: newItems.reduce((s, i) => s + i.quantity, 0) });
    },
    updateQuantity: (productId, quantity) => {
        const newItems = get().items.map((i) => i.id === productId ? { ...i, quantity } : i);
        set({ items: newItems, totalPrice: newItems.reduce((s, i) => s + i.price * i.quantity, 0), totalItems: newItems.reduce((s, i) => s + i.quantity, 0) });
    },
    clearCart: () => set({ items: [], totalPrice: 0, totalItems: 0 }),
    totalPrice: 0,
    totalItems: 0,
}));
