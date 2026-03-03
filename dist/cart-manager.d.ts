/**
 * Shopping Cart Manager
 * Handles cart operations with TypeScript strict typing and error handling
 */
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sku?: string;
    imageUrl?: string;
    category?: string;
    type?: string;
}
interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    lastUpdated: number;
}
declare class CartManager {
    private cart;
    private readonly STORAGE_KEY;
    private readonly MAX_QUANTITY;
    private listeners;
    constructor();
    /**
     * Initialize cart manager
     */
    private init;
    /**
     * Setup event listeners for cart actions
     */
    private setupEventListeners;
    /**
     * Setup quantity increase/decrease controls
     */
    private setupQuantityControls;
    /**
     * Handle add to cart action
     */
    private handleAddToCart;
    /**
     * Handle buy now action
     */
    private handleBuyNow;
    /**
     * Get product data from API or store
     */
    private getProductData;
    /**
     * Add item to cart
     */
    addItem(item: CartItem): Promise<void>;
    /**
     * Remove item from cart
     */
    removeItem(itemId: string): Promise<void>;
    /**
     * Update item quantity
     */
    updateQuantity(itemId: string, quantity: number): Promise<void>;
    /**
     * Clear cart
     */
    clearCart(): Promise<void>;
    /**
     * Get cart state
     */
    getState(): CartState;
    /**
     * Get cart total
     */
    getTotal(): number;
    /**
     * Get total item count
     */
    getItemCount(): number;
    /**
     * Validate cart item
     */
    private validateCartItem;
    /**
     * Save cart to localStorage
     */
    private saveCart;
    /**
     * Load cart from localStorage
     */
    private loadCart;
    /**
     * Update UI elements
     */
    private updateUI;
    /**
     * Subscribe to cart changes
     */
    subscribe(listener: (cart: CartState) => void): () => void;
    /**
     * Notify all listeners of cart changes
     */
    private notifyListeners;
    /**
     * Create typed error
     */
    private createError;
}
export declare const cartManager: CartManager;
export {};
//# sourceMappingURL=cart-manager.d.ts.map