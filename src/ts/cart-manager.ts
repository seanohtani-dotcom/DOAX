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

interface CartError extends Error {
  code: string;
  details?: any;
}

class CartManager {
  private cart: CartItem[] = [];
  private readonly STORAGE_KEY = "venusVacation_cart";
  private readonly MAX_QUANTITY = 10;
  private listeners: Set<(cart: CartState) => void> = new Set();

  constructor() {
    this.loadCart();
    this.init();
  }

  /**
   * Initialize cart manager
   */
  private init(): void {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupEventListeners(),
      );
    } else {
      this.setupEventListeners();
    }
  }

  /**
   * Setup event listeners for cart actions
   */
  private setupEventListeners(): void {
    // Add to cart buttons
    document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
      if (!(button instanceof HTMLElement)) return;

      button.addEventListener("click", async (event) => {
        event.preventDefault();
        const productId = button.dataset.addToCart;

        if (!productId) {
          console.error("No product ID specified");
          return;
        }

        await this.handleAddToCart(productId, button);
      });
    });

    // Buy now button in modal
    const buyNowBtn = document.getElementById("buyNowBtn");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", async () => {
        await this.handleBuyNow();
      });
    }

    // Quantity controls
    this.setupQuantityControls();
  }

  /**
   * Setup quantity increase/decrease controls
   */
  private setupQuantityControls(): void {
    const decreaseBtn = document.getElementById("decreaseQty");
    const increaseBtn = document.getElementById("increaseQty");
    const quantityInput = document.getElementById(
      "quantity",
    ) as HTMLInputElement;

    if (!decreaseBtn || !increaseBtn || !quantityInput) {
      console.warn("Quantity controls not found");
      return;
    }

    decreaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue > 1) {
        quantityInput.value = (currentValue - 1).toString();
      }
    });

    increaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue < this.MAX_QUANTITY) {
        quantityInput.value = (currentValue + 1).toString();
      }
    });

    // Validate input
    quantityInput.addEventListener("input", () => {
      let value = parseInt(quantityInput.value);

      if (isNaN(value) || value < 1) {
        value = 1;
      } else if (value > this.MAX_QUANTITY) {
        value = this.MAX_QUANTITY;
      }

      quantityInput.value = value.toString();
    });
  }

  /**
   * Handle add to cart action
   */
  private async handleAddToCart(
    productId: string,
    button: HTMLElement,
  ): Promise<void> {
    try {
      // Disable button during processing
      button.setAttribute("disabled", "true");
      button.textContent = "Adding...";

      // Get product data
      const product = await this.getProductData(productId);

      if (!product) {
        throw this.createError(
          "PRODUCT_NOT_FOUND",
          `Product ${productId} not found`,
        );
      }

      // Add to cart
      await this.addItem(product);

      // Show success feedback
      if (typeof window.showToast === "function") {
        window.showToast(`Added ${product.name} to cart!`, "success");
      }

      // Update button state
      button.textContent = "✓ Added";
      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.removeAttribute("disabled");
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to add item to cart";

      if (typeof window.showToast === "function") {
        window.showToast(errorMessage, "error");
      }

      // Reset button
      button.textContent = "Add to Cart";
      button.removeAttribute("disabled");
    }
  }

  /**
   * Handle buy now action
   */
  private async handleBuyNow(): Promise<void> {
    try {
      const modal = document.getElementById("productModal");
      if (!modal) {
        throw this.createError("MODAL_NOT_FOUND", "Product modal not found");
      }

      const productId = modal.dataset.productId;
      if (!productId) {
        throw this.createError("NO_PRODUCT_ID", "No product selected");
      }

      const quantityInput = document.getElementById(
        "quantity",
      ) as HTMLInputElement;
      const quantity = parseInt(quantityInput?.value || "1");

      if (isNaN(quantity) || quantity < 1) {
        throw this.createError(
          "INVALID_QUANTITY",
          "Invalid quantity specified",
        );
      }

      // Get product data
      const product = await this.getProductData(productId);

      if (!product) {
        throw this.createError(
          "PRODUCT_NOT_FOUND",
          `Product ${productId} not found`,
        );
      }

      // Add to cart with specified quantity
      await this.addItem({ ...product, quantity });

      // Show success and redirect to checkout
      if (typeof window.showToast === "function") {
        window.showToast(
          "Added to cart! Redirecting to checkout...",
          "success",
        );
      }

      // Close modal
      if (typeof window.closeModal === "function") {
        window.closeModal("productModal");
      }

      // Redirect to checkout after short delay
      setTimeout(() => {
        window.location.href = "buy-now.html";
      }, 1000);
    } catch (error) {
      console.error("Error in buy now:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to process purchase";

      if (typeof window.showToast === "function") {
        window.showToast(errorMessage, "error");
      }
    }
  }

  /**
   * Get product data from API or store
   */
  private async getProductData(productId: string): Promise<CartItem | null> {
    try {
      // Try to get from global store first
      if (typeof window.store !== "undefined" && window.store.products) {
        const product = window.store.products.find(
          (p: any) => p.id === productId,
        );

        if (product) {
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            sku: product.id,
            imageUrl: product.images
              ? JSON.parse(product.images)[0]
              : undefined,
            category: product.category,
            type: product.type,
          };
        }
      }

      // Fallback: Try API
      const response = await fetch(
        `http://localhost:3000/api/products/${productId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const product = data.data;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          sku: product.id,
          imageUrl: product.images ? JSON.parse(product.images)[0] : undefined,
          category: product.category,
          type: product.type,
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  }

  /**
   * Add item to cart
   */
  public async addItem(item: CartItem): Promise<void> {
    // Validate item
    this.validateCartItem(item);

    // Check if item already exists
    const existingIndex = this.cart.findIndex(
      (cartItem) => cartItem.id === item.id,
    );

    if (existingIndex !== -1) {
      // Update quantity
      const newQuantity = this.cart[existingIndex].quantity + item.quantity;

      if (newQuantity > this.MAX_QUANTITY) {
        throw this.createError(
          "MAX_QUANTITY_EXCEEDED",
          `Cannot add more than ${this.MAX_QUANTITY} of this item`,
        );
      }

      this.cart[existingIndex].quantity = newQuantity;
    } else {
      // Add new item
      this.cart.push({ ...item });
    }

    // Save and notify
    await this.saveCart();
    this.notifyListeners();
    this.updateUI();

    console.log("✅ Item added to cart:", item.name);
  }

  /**
   * Remove item from cart
   */
  public async removeItem(itemId: string): Promise<void> {
    const index = this.cart.findIndex((item) => item.id === itemId);

    if (index === -1) {
      throw this.createError(
        "ITEM_NOT_FOUND",
        `Item ${itemId} not found in cart`,
      );
    }

    const removedItem = this.cart.splice(index, 1)[0];

    await this.saveCart();
    this.notifyListeners();
    this.updateUI();

    console.log("✅ Item removed from cart:", removedItem.name);

    if (typeof window.showToast === "function") {
      window.showToast(`Removed ${removedItem.name} from cart`, "info");
    }
  }

  /**
   * Update item quantity
   */
  public async updateQuantity(itemId: string, quantity: number): Promise<void> {
    if (quantity < 1 || quantity > this.MAX_QUANTITY) {
      throw this.createError(
        "INVALID_QUANTITY",
        `Quantity must be between 1 and ${this.MAX_QUANTITY}`,
      );
    }

    const item = this.cart.find((cartItem) => cartItem.id === itemId);

    if (!item) {
      throw this.createError(
        "ITEM_NOT_FOUND",
        `Item ${itemId} not found in cart`,
      );
    }

    item.quantity = quantity;

    await this.saveCart();
    this.notifyListeners();
    this.updateUI();
  }

  /**
   * Clear cart
   */
  public async clearCart(): Promise<void> {
    this.cart = [];
    await this.saveCart();
    this.notifyListeners();
    this.updateUI();

    console.log("✅ Cart cleared");
  }

  /**
   * Get cart state
   */
  public getState(): CartState {
    return {
      items: [...this.cart],
      total: this.getTotal(),
      itemCount: this.getItemCount(),
      lastUpdated: Date.now(),
    };
  }

  /**
   * Get cart total
   */
  public getTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  /**
   * Get total item count
   */
  public getItemCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Validate cart item
   */
  private validateCartItem(item: CartItem): void {
    if (!item.id || typeof item.id !== "string") {
      throw this.createError("INVALID_ITEM", "Item ID is required");
    }

    if (!item.name || typeof item.name !== "string") {
      throw this.createError("INVALID_ITEM", "Item name is required");
    }

    if (typeof item.price !== "number" || item.price < 0) {
      throw this.createError("INVALID_ITEM", "Invalid item price");
    }

    if (
      typeof item.quantity !== "number" ||
      item.quantity < 1 ||
      item.quantity > this.MAX_QUANTITY
    ) {
      throw this.createError(
        "INVALID_ITEM",
        `Quantity must be between 1 and ${this.MAX_QUANTITY}`,
      );
    }
  }

  /**
   * Save cart to localStorage
   */
  private async saveCart(): Promise<void> {
    try {
      const cartData = JSON.stringify(this.cart);
      localStorage.setItem(this.STORAGE_KEY, cartData);
      console.log("💾 Cart saved to localStorage");
    } catch (error) {
      console.error("Failed to save cart:", error);
      throw this.createError("STORAGE_ERROR", "Failed to save cart");
    }
  }

  /**
   * Load cart from localStorage
   */
  private loadCart(): void {
    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY);

      if (cartData) {
        const parsed = JSON.parse(cartData);

        if (Array.isArray(parsed)) {
          this.cart = parsed;
          console.log(`📦 Loaded ${this.cart.length} items from cart`);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      this.cart = [];
    }
  }

  /**
   * Update UI elements
   */
  private updateUI(): void {
    // Update cart count badge
    const cartCountElements = document.querySelectorAll(
      ".cart-count, #cartCount",
    );
    const itemCount = this.getItemCount();

    cartCountElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.textContent = itemCount.toString();
        element.style.display = itemCount > 0 ? "flex" : "none";
      }
    });

    // Update cart total
    const cartTotalElements = document.querySelectorAll(
      ".cart-total, #cartTotal",
    );
    const total = this.getTotal();

    cartTotalElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.textContent = `$${total.toFixed(2)}`;
      }
    });
  }

  /**
   * Subscribe to cart changes
   */
  public subscribe(listener: (cart: CartState) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of cart changes
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error("Error in cart listener:", error);
      }
    });
  }

  /**
   * Create typed error
   */
  private createError(code: string, message: string, details?: any): CartError {
    const error = new Error(message) as CartError;
    error.code = code;
    error.details = details;
    return error;
  }
}

// Export singleton instance
export const cartManager = new CartManager();

// Make available globally
if (typeof window !== "undefined") {
  (window as any).cartManager = cartManager;
}
