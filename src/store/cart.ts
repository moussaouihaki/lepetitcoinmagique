import { create } from 'zustand';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
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

        if (existing) {
            set({
                items: items.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            });
        } else {
            set({ items: [...items, { ...product, quantity: 1 }] });
        }
    },
    removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
    },
    updateQuantity: (productId, quantity) => {
        set({
            items: get().items.map((i) =>
                i.id === productId ? { ...i, quantity } : i
            ),
        });
    },
    clearCart: () => set({ items: [] }),
    get totalPrice() {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
    },
}));
