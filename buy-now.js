// Venus Vacation PRISM - Buy Now System
class VenusVacationStore {
  constructor() {
    this.apiUrl = "http://localhost:3000/api";
    this.wishlist = [];
    this.products = [];
    this.currentUser = null;
    this.sessionId = this.getOrCreateSessionId();

    this.init();
  }

  getOrCreateSessionId() {
    let sessionId = localStorage.getItem("venusVacationSessionId");
    if (!sessionId) {
      sessionId =
        "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("venusVacationSessionId", sessionId);
    }
    return sessionId;
  }

  async init() {
    await this.loadProducts();
    await this.loadWishlist();
    this.setupEventListeners();
    this.updateWishlistUI();
    this.updateWishlistCount();
  }

  // API Methods
  async loadProducts() {
    try {
      console.log("Loading products from:", `${this.apiUrl}/products`);
      const response = await fetch(`${this.apiUrl}/products`);
      const data = await response.json();

      if (data.success) {
        this.products = data.data;
        console.log(
          "✅ Products loaded successfully:",
          this.products.length,
          "products"
        );
        console.log(
          "Product IDs:",
          this.products.map((p) => p.id)
        );
      } else {
        console.error("Failed to load products from API, using demo products");
        this.products = this.getDemoProducts();
      }
    } catch (error) {
      console.error("Error loading products:", error);
      console.log("Using demo products as fallback");
      // Fallback to demo products if API is not available
      this.products = this.getDemoProducts();
    }
  }

  getDemoProducts() {
    return [
      {
        id: "1",
        name: "Venus Vacation PRISM - Standard Edition",
        description:
          "The base game featuring all 6 Venus characters in stunning detail. Experience the tropical paradise with enhanced graphics and new gameplay mechanics.",
        price: 59.99,
        category: "game",
        type: "physical",
        images: ["img/top-products_normal.webp"],
        stock: 100,
        metadata: {
          platforms: ["PS5", "PS4"],
          features: ["Base Game", "6 Characters", "Story Mode"],
          releaseDate: "2024-03-07",
        },
      },
      {
        id: "2",
        name: "Venus Vacation PRISM - Digital Deluxe Edition",
        description:
          "Premium digital edition with exclusive content, season pass, and bonus outfits for all characters.",
        price: 89.99,
        category: "game",
        type: "digital",
        images: ["img/top-products_ddx-ug-en.webp"],
        stock: 999,
        metadata: {
          platforms: ["PS5", "PS4", "Steam"],
          features: [
            "Base Game",
            "Season Pass",
            "Exclusive Outfits",
            "Digital Soundtrack",
          ],
          releaseDate: "2024-03-07",
        },
      },
      {
        id: "3",
        name: "Cheongsam Outfits Set",
        description:
          "Beautiful traditional cheongsam outfits for all 6 characters. Early purchase bonus content.",
        price: 14.99,
        category: "dlc",
        type: "digital",
        images: ["img/top-products_bene-early.webp"],
        stock: 999,
        metadata: {
          platforms: ["PS5", "PS4", "Steam"],
          features: ["6 Outfits", "All Characters", "Early Purchase Bonus"],
          characters: [
            "Misaki",
            "Honoka",
            "Tamaki",
            "Fiona",
            "Nanami",
            "Elise",
          ],
        },
      },
      {
        id: "4",
        name: "Plumeria Hair Ornament Hairstyles",
        description:
          "Elegant plumeria hair ornament hairstyles for all characters. Digital pre-order exclusive.",
        price: 9.99,
        category: "dlc",
        type: "digital",
        images: ["img/top-products_bene-preorder.webp"],
        stock: 999,
        metadata: {
          platforms: ["PS5", "PS4", "Steam"],
          features: ["6 Hairstyles", "All Characters", "Pre-order Bonus"],
          characters: [
            "Misaki",
            "Honoka",
            "Tamaki",
            "Fiona",
            "Nanami",
            "Elise",
          ],
        },
      },
      {
        id: "5",
        name: "Resort Cami Dress (Blue) - Misaki SSR",
        description:
          "Exclusive SSR swimsuit for Misaki in beautiful blue. Linked purchase bonus for Venus Vacation players.",
        price: 19.99,
        category: "dlc",
        type: "digital",
        images: ["img/top-products_bene-doaxvv-gl.webp"],
        stock: 999,
        metadata: {
          platforms: ["Venus Vacation"],
          features: [
            "SSR Swimsuit",
            "Misaki Exclusive",
            "Linked Purchase Bonus",
          ],
          character: "Misaki",
          rarity: "SSR",
        },
      },
    ];
  }

  // Wishlist Management
  async loadWishlist() {
    try {
      const response = await fetch(
        `${this.apiUrl}/wishlist?sessionId=${this.sessionId}`
      );
      const data = await response.json();

      if (data.success) {
        this.wishlist = data.data;
        console.log("Wishlist loaded from server:", this.wishlist);
      } else {
        console.error("Failed to load wishlist:", data.error);
        this.wishlist = [];
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      this.wishlist = [];
    }
  }

  async addToWishlist(productId) {
    console.log("🔵 addToWishlist called with productId:", productId);
    console.log("📦 Available products:", this.products.length);
    console.log("💖 Current wishlist:", this.wishlist.length, "items");

    // Validate product exists
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      console.error("❌ Product not found:", productId);
      console.error(
        "Available product IDs:",
        this.products.map((p) => p.id)
      );
      this.showWishlistNotification("❌ Product not found");
      return false;
    }

    console.log("✅ Found product:", product.name);

    // Check if already in wishlist
    const existingItem = this.wishlist.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      console.log("ℹ️ Product already in wishlist");
      this.showWishlistNotification(
        `${product.name} is already in your wishlist`
      );
      return false;
    }

    try {
      console.log("📤 Sending request to API:", {
        url: `${this.apiUrl}/wishlist/add`,
        productId,
        sessionId: this.sessionId,
      });

      const response = await fetch(`${this.apiUrl}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          sessionId: this.sessionId,
        }),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP error:", response.status, errorText);
        this.showWishlistNotification(
          `Failed to add to wishlist (HTTP ${response.status})`
        );
        return false;
      }

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (data.success) {
        console.log("✅ Successfully added to wishlist");
        this.wishlist.push(data.data);
        this.updateWishlistUI();
        this.updateWishlistCount();
        this.showWishlistNotification(`✅ Added ${product.name} to wishlist`);
        return true;
      } else {
        console.error("❌ API returned error:", data.error);
        this.showWishlistNotification(
          data.error?.message || "Failed to add to wishlist"
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Exception in addToWishlist:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      this.showWishlistNotification(
        `Failed to add to wishlist: ${error.message}`
      );
      return false;
    }
  }

  async removeFromWishlist(productId) {
    try {
      const response = await fetch(
        `${this.apiUrl}/wishlist/${productId}?sessionId=${this.sessionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        this.wishlist = this.wishlist.filter(
          (item) => item.productId !== productId
        );
        this.updateWishlistUI();
        this.updateWishlistCount();
      } else {
        console.error("Failed to remove from wishlist:", data.error);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  }

  async clearWishlist() {
    try {
      const response = await fetch(
        `${this.apiUrl}/wishlist?sessionId=${this.sessionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        this.wishlist = [];
        this.updateWishlistUI();
        this.updateWishlistCount();
      } else {
        console.error("Failed to clear wishlist:", data.error);
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  }

  isInWishlist(productId) {
    return this.wishlist.some((item) => item.productId === productId);
  }

  // UI Methods
  setupEventListeners() {
    // Product modal events
    const productModal = document.getElementById("productModal");
    const cartSidebar = document.getElementById("cartSidebar");
    const checkoutModal = document.getElementById("checkoutModal");

    // Close modal events - simplified and more reliable
    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Close button clicked");
        const modal = e.target.closest(".modal");
        if (modal) {
          console.log("Closing modal:", modal.id);
          modal.style.display = "none";
          // Reset modal states
          if (modal.id === "checkoutModal") {
            this.currentCheckoutStep = 1;
            this.tempCart = [];
            this.goToStep(1);
          }
          if (modal.id === "productModal") {
            const qtyInput = document.getElementById("quantity");
            if (qtyInput) qtyInput.value = 1;
          }
        }
      });
    });

    // Wishlist icon click
    document.getElementById("wishlistIcon")?.addEventListener("click", () => {
      this.openWishlist();
    });

    // Close wishlist
    document.getElementById("closeWishlist")?.addEventListener("click", () => {
      this.closeWishlist();
    });

    // Quantity controls in modal
    document.getElementById("decreaseQty")?.addEventListener("click", () => {
      const qtyInput = document.getElementById("quantity");
      const currentQty = parseInt(qtyInput.value);
      if (currentQty > 1) {
        qtyInput.value = currentQty - 1;
      }
    });

    document.getElementById("increaseQty")?.addEventListener("click", () => {
      const qtyInput = document.getElementById("quantity");
      const currentQty = parseInt(qtyInput.value);
      if (currentQty < 10) {
        qtyInput.value = currentQty + 1;
      }
    });

    // Add to wishlist button
    document
      .getElementById("addToWishlistBtn")
      ?.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Add to wishlist clicked - modal should stay open");

        const modal = document.getElementById("productModal");
        const productId = modal?.dataset.productId;

        if (!productId) {
          console.error("No product ID found");
          this.showWishlistNotification("Error: No product selected");
          return false;
        }

        // Add to wishlist
        const success = await this.addToWishlist(productId);

        // Update button state if successful
        if (success) {
          this.updateWishlistButtonState(productId);
        }

        // Ensure modal stays open
        if (modal) {
          modal.style.display = "block";
        }

        console.log(
          "Wishlist operation completed - modal should still be open"
        );
        return false;
      });

    // Buy now button
    document.getElementById("buyNowBtn")?.addEventListener("click", () => {
      const productId =
        document.getElementById("productModal").dataset.productId;
      const quantity = parseInt(document.getElementById("quantity").value);

      // Create a temporary cart with this item for checkout
      this.tempCart = [
        {
          productId,
          quantity,
          product: this.products.find((p) => p.id === productId),
        },
      ];

      // Close modal and open checkout
      document.getElementById("productModal").style.display = "none";
      this.openCheckout();
    });

    // Clear wishlist button
    document
      .getElementById("clearWishlistBtn")
      ?.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your wishlist?")) {
          this.clearWishlist();
        }
      });

    // Checkout steps - make step headers clickable
    document.querySelectorAll(".step").forEach((step, index) => {
      step.addEventListener("click", () => {
        const stepNumber = index + 1;
        if (stepNumber <= this.getCurrentMaxStep()) {
          this.goToStep(stepNumber);
        }
      });
      step.style.cursor = "pointer";
    });

    document.getElementById("nextToPayment")?.addEventListener("click", () => {
      if (this.validateShippingForm()) {
        this.goToStep(2);
      }
    });

    document.getElementById("backToShipping")?.addEventListener("click", () => {
      this.goToStep(1);
    });

    document
      .getElementById("nextToConfirmation")
      ?.addEventListener("click", () => {
        if (this.validatePaymentForm()) {
          this.showOrderConfirmation();
          this.goToStep(3);
        }
      });

    document.getElementById("backToPayment")?.addEventListener("click", () => {
      this.goToStep(2);
    });

    // Place order
    document.getElementById("placeOrder")?.addEventListener("click", () => {
      this.placeOrder();
    });

    // Success message close
    document.getElementById("closeSuccess")?.addEventListener("click", () => {
      document.getElementById("successMessage").style.display = "none";
    });

    // Click outside modal to close
    window.addEventListener("click", (e) => {
      // Only close if clicking directly on the modal background
      // Don't close if clicking on buttons or other interactive elements
      if (
        e.target.classList.contains("modal") &&
        !e.target.closest(".modal-content") &&
        e.target.tagName !== "BUTTON"
      ) {
        e.target.style.display = "none";
        // Reset checkout step when closing checkout modal
        if (e.target.id === "checkoutModal") {
          this.currentCheckoutStep = 1;
          this.tempCart = [];
        }
      }
    });

    // ESC key to close modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
          openModal.style.display = "none";
          // Reset modal states
          if (openModal.id === "checkoutModal") {
            this.currentCheckoutStep = 1;
            this.tempCart = [];
          }
          if (openModal.id === "productModal") {
            const qtyInput = document.getElementById("quantity");
            if (qtyInput) qtyInput.value = 1;
          }
        }
      }
    });

    // Removed redundant backup listeners - main close handlers are sufficient
  }

  showProductModal(productId) {
    console.log("showProductModal called with productId:", productId);
    console.log("Available products:", this.products);

    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      console.error("Product not found:", productId);
      console.error(
        "Available product IDs:",
        this.products.map((p) => p.id)
      );
      alert(
        `Product with ID ${productId} not found. Available products: ${this.products
          .map((p) => p.id)
          .join(", ")}`
      );
      return;
    }

    console.log("Found product:", product);

    const modal = document.getElementById("productModal");
    modal.dataset.productId = productId;

    // Update modal content
    document.getElementById("modalProductName").textContent = product.name;
    document.getElementById("modalProductDescription").textContent =
      product.description;
    document.getElementById(
      "modalProductPrice"
    ).textContent = `$${product.price.toFixed(2)}`;

    const imageElement = document.getElementById("modalProductImage");
    imageElement.src = product.images[0] || "img/placeholder.jpg";
    imageElement.alt = product.name;

    // Update metadata
    const metadataContainer = document.getElementById("modalProductMetadata");
    metadataContainer.innerHTML = "";

    if (product.metadata) {
      if (product.metadata.platforms) {
        const platformsDiv = document.createElement("div");
        platformsDiv.className = "metadata-item";
        platformsDiv.innerHTML = `
          <span class="metadata-label">Platforms:</span>
          <span class="metadata-value">${product.metadata.platforms.join(
            ", "
          )}</span>
        `;
        metadataContainer.appendChild(platformsDiv);
      }

      if (product.metadata.features) {
        const featuresDiv = document.createElement("div");
        featuresDiv.className = "metadata-item";
        featuresDiv.innerHTML = `
          <span class="metadata-label">Features:</span>
          <span class="metadata-value">${product.metadata.features.join(
            ", "
          )}</span>
        `;
        metadataContainer.appendChild(featuresDiv);
      }

      if (product.type) {
        const typeDiv = document.createElement("div");
        typeDiv.className = "metadata-item";
        typeDiv.innerHTML = `
          <span class="metadata-label">Type:</span>
          <span class="metadata-value">${
            product.type === "digital" ? "Digital Download" : "Physical Copy"
          }</span>
        `;
        metadataContainer.appendChild(typeDiv);
      }
    }

    // Reset quantity
    document.getElementById("quantity").value = 1;

    // Update wishlist button state
    this.updateWishlistButtonState(productId);

    // Show modal with enhanced animation
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  }

  openWishlist() {
    document.getElementById("wishlistSidebar").classList.add("open");
  }

  closeWishlist() {
    document.getElementById("wishlistSidebar").classList.remove("open");
  }

  updateWishlistUI() {
    const wishlistItemsContainer = document.getElementById("wishlistItems");

    if (this.wishlist.length === 0) {
      wishlistItemsContainer.innerHTML = `
        <div class="empty-wishlist">
          <div class="empty-wishlist-icon">💖</div>
          <p>Your wishlist is empty</p>
          <p class="empty-wishlist-subtitle">Add items you love to save for later!</p>
        </div>
      `;
    } else {
      wishlistItemsContainer.innerHTML = this.wishlist
        .map(
          (item) => `
        <div class="wishlist-item" data-product-id="${item.productId}">
          <div class="wishlist-item-image">
            <img src="${
              item.product.images[0] || "img/placeholder.jpg"
            }" alt="${item.product.name}">
          </div>
          <div class="wishlist-item-details">
            <div class="wishlist-item-name">${item.product.name}</div>
            <div class="wishlist-item-price">$${item.product.price.toFixed(
              2
            )}</div>
            <div class="wishlist-item-actions">
              <button class="buy-from-wishlist" onclick="store.buyFromWishlist('${
                item.productId
              }')">Buy Now</button>
              <button class="remove-from-wishlist" onclick="store.removeFromWishlist('${
                item.productId
              }')">Remove</button>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    }
  }

  updateWishlistCount() {
    const count = this.wishlist.length;
    const countElement = document.getElementById("wishlistCount");
    if (countElement) {
      countElement.textContent = count;
      countElement.style.display = count > 0 ? "flex" : "none";
    }
  }

  showWishlistNotification(message) {
    console.log("Wishlist notification:", message);

    // Create enhanced notification
    const notification = document.createElement("div");
    notification.className = "wishlist-notification";

    // Add icon based on message type
    const isAdded = message.includes("Added");
    const icon = isAdded ? "💖" : "ℹ️";

    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-content">
        <div class="notification-title">${
          isAdded ? "Added to Wishlist!" : "Wishlist Update"
        }</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b9d, #4ecdc4);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 350px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    // Add styles for notification elements
    const style = document.createElement("style");
    style.textContent = `
      .notification-icon {
        font-size: 24px;
        animation: bounce 0.6s ease-in-out;
      }
      .notification-content {
        flex: 1;
      }
      .notification-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 2px;
      }
      .notification-message {
        font-size: 12px;
        opacity: 0.9;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
      }
      .notification-close:hover {
        opacity: 1;
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = "slideOutRight 0.4s ease-out";
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 400);
      }
    }, 4000);
  }

  buyFromWishlist(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      // Create a temporary cart with this item for checkout
      this.tempCart = [
        {
          productId,
          quantity: 1,
          product: product,
        },
      ];

      this.closeWishlist();
      this.openCheckout();
    }
  }

  updateWishlistButtonState(productId) {
    const wishlistBtn = document.getElementById("addToWishlistBtn");
    const isInWishlist = this.isInWishlist(productId);

    if (wishlistBtn) {
      if (isInWishlist) {
        wishlistBtn.innerHTML = "💖 In Wishlist";
        wishlistBtn.classList.add("in-wishlist");
        wishlistBtn.disabled = true;
      } else {
        wishlistBtn.innerHTML = "🤍 Add to Wishlist";
        wishlistBtn.classList.remove("in-wishlist");
        wishlistBtn.disabled = false;
      }
    }
  }

  addEnhancedLoadingState(buttonId, duration = 1000) {
    const button = document.getElementById(buttonId);
    if (button) {
      const originalText = button.innerHTML;
      button.classList.add("loading");
      button.innerHTML = "<span>" + originalText + "</span>";

      setTimeout(() => {
        button.classList.remove("loading");
        button.innerHTML = originalText;
      }, duration);
    }
  }

  // Checkout Methods
  openCheckout() {
    const itemsToCheckout = this.tempCart || [];
    if (itemsToCheckout.length === 0) {
      alert("No items to checkout!");
      return;
    }

    this.closeWishlist();
    this.currentCheckoutStep = 1;
    document.getElementById("checkoutModal").style.display = "block";
    this.goToStep(1);

    // Pre-fill checkout summary
    this.updateCheckoutSummary();
  }

  goToStep(stepNumber) {
    this.currentCheckoutStep = stepNumber;

    // Update step indicators
    document.querySelectorAll(".step").forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.toggle("active", stepNum === stepNumber);
      step.classList.toggle("completed", stepNum < stepNumber);

      // Enable/disable step clicking
      if (stepNum <= this.getCurrentMaxStep()) {
        step.style.opacity = "1";
        step.style.cursor = "pointer";
      } else {
        step.style.opacity = "0.5";
        step.style.cursor = "not-allowed";
      }
    });

    // Show/hide step content
    document.querySelectorAll(".checkout-step").forEach((step, index) => {
      step.classList.toggle("active", index + 1 === stepNumber);
    });
  }

  getCurrentMaxStep() {
    // Users can only go to steps they've completed or the next step
    return Math.max(1, this.currentCheckoutStep || 1);
  }

  validateShippingForm() {
    const form = document.getElementById("shippingForm");
    const formData = new FormData(form);

    // Clear previous errors
    document.querySelectorAll(".form-error").forEach((error) => error.remove());

    // Basic validation
    const required = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];
    let isValid = true;

    for (const field of required) {
      const value = formData.get(field);
      const input = document.getElementById(field);

      if (!value || value.trim() === "") {
        this.showFieldError(input, `This field is required`);
        isValid = false;
      }
    }

    // Email validation
    const email = formData.get("email");
    const emailInput = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      this.showFieldError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    if (isValid) {
      this.currentCheckoutStep = Math.max(this.currentCheckoutStep, 2);
    }

    return isValid;
  }

  showFieldError(input, message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "form-error";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #ff4757;
      font-size: 12px;
      margin-top: 5px;
      animation: shake 0.3s ease-in-out;
    `;

    input.style.borderColor = "#ff4757";
    input.parentNode.appendChild(errorDiv);

    // Remove error on input
    input.addEventListener(
      "input",
      () => {
        input.style.borderColor = "";
        errorDiv.remove();
      },
      { once: true }
    );
  }

  validatePaymentForm() {
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;
    const cardName = document.getElementById("cardName").value;

    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      alert("Please fill in all payment fields.");
      return false;
    }

    // Basic card number validation (remove spaces and check length)
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      alert("Please enter a valid card number.");
      return false;
    }

    // Expiry date validation (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
      alert("Please enter expiry date in MM/YY format.");
      return false;
    }

    // CVV validation
    if (cvv.length < 3 || cvv.length > 4) {
      alert("Please enter a valid CVV.");
      return false;
    }

    return true;
  }

  showOrderConfirmation() {
    const itemsToCheckout = this.tempCart || [];
    const totals = this.getCheckoutTotal();

    // Order items
    const itemsHtml = itemsToCheckout
      .map(
        (item) => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span>${item.product.name} x${item.quantity}</span>
        <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
      </div>
    `
      )
      .join("");
    document.getElementById("confirmationItems").innerHTML = itemsHtml;

    // Shipping address
    const form = document.getElementById("shippingForm");
    const formData = new FormData(form);
    const shippingHtml = `
      <div>${formData.get("firstName")} ${formData.get("lastName")}</div>
      <div>${formData.get("address")}</div>
      <div>${formData.get("city")}, ${formData.get("state")} ${formData.get(
      "zipCode"
    )}</div>
      <div>${formData.get("country")}</div>
    `;
    document.getElementById("confirmationShipping").innerHTML = shippingHtml;

    // Payment method
    const cardNumber = document.getElementById("cardNumber").value;
    const maskedCard = "**** **** **** " + cardNumber.slice(-4);
    document.getElementById("confirmationPayment").innerHTML = `
      <div>Credit Card ending in ${cardNumber.slice(-4)}</div>
    `;

    // Order total
    const totalHtml = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Subtotal:</span>
        <span>$${totals.subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Tax:</span>
        <span>$${totals.tax.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Shipping:</span>
        <span>$${totals.shipping.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #ddd; padding-top: 10px;">
        <span>Total:</span>
        <span>$${totals.total.toFixed(2)}</span>
      </div>
    `;
    document.getElementById("confirmationTotal").innerHTML = totalHtml;
  }

  async placeOrder() {
    console.log("🛒 Placing order...");

    // Show loading
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }

    try {
      const orderData = {
        items: this.tempCart || [],
        shippingAddress: this.getShippingData(),
        billingAddress: this.getShippingData(), // Using same as shipping for now
        paymentMethod: this.getPaymentData(),
      };

      console.log("📤 Sending order data:", orderData);

      // Create order
      const orderResponse = await fetch(`${this.apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("📥 Order response status:", orderResponse.status);

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("❌ Order creation failed:", errorText);
        throw new Error(
          `Failed to create order (HTTP ${orderResponse.status})`
        );
      }

      const orderResult = await orderResponse.json();
      console.log("✅ Order created:", orderResult);

      if (!orderResult.success) {
        throw new Error(orderResult.error?.message || "Failed to create order");
      }

      // Process payment
      console.log("💳 Processing payment...");
      const paymentResponse = await fetch(`${this.apiUrl}/payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderResult.data.orderId,
          amount: orderResult.data.total,
          paymentMethod: this.getPaymentData(),
        }),
      });

      console.log("📥 Payment response status:", paymentResponse.status);

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error("❌ Payment failed:", errorText);
        throw new Error(`Payment failed (HTTP ${paymentResponse.status})`);
      }

      const paymentResult = await paymentResponse.json();
      console.log("✅ Payment processed:", paymentResult);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error?.message || "Payment failed");
      }

      console.log("🎉 Order placed successfully!");
      console.log("Order ID:", orderResult.data.orderId);
      console.log("Payment ID:", paymentResult.data.paymentId);

      // Clear temp cart
      this.tempCart = [];

      // Hide loading and checkout modal
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }

      const checkoutModal = document.getElementById("checkoutModal");
      if (checkoutModal) {
        checkoutModal.style.display = "none";
      }

      // Show success message
      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.style.display = "flex";
      }
    } catch (error) {
      console.error("❌ Order placement failed:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });

      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }

      alert(
        `Order placement failed: ${error.message}\n\nPlease check the console for more details.`
      );
    }
  }

  getShippingData() {
    const form = document.getElementById("shippingForm");
    const formData = new FormData(form);
    return Object.fromEntries(formData);
  }

  getPaymentData() {
    return {
      type: "card",
      cardNumber: document.getElementById("cardNumber").value.slice(-4),
      cardName: document.getElementById("cardName").value,
    };
  }

  getCheckoutTotal() {
    const itemsToCheckout = this.tempCart || [];
    const subtotal = itemsToCheckout.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const shipping = itemsToCheckout.some(
      (item) => item.product.type === "physical"
    )
      ? 9.99
      : 0;

    return {
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: subtotal + tax + shipping,
    };
  }

  updateCheckoutSummary() {
    const itemsToCheckout = this.tempCart || [];
    const totals = this.getCheckoutTotal();

    // Add a mini summary to each checkout step
    const summaryHtml = `
      <div class="checkout-mini-summary">
        <h4>Order Summary</h4>
        ${itemsToCheckout
          .map(
            (item) => `
          <div class="summary-item">
            <span>${item.product.name} x${item.quantity}</span>
            <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        `
          )
          .join("")}
        <div class="summary-total">
          <strong>Total: $${totals.total.toFixed(2)}</strong>
        </div>
      </div>
    `;

    // Add summary to each step if it doesn't exist
    document.querySelectorAll(".checkout-step").forEach((step) => {
      if (!step.querySelector(".checkout-mini-summary")) {
        const summaryDiv = document.createElement("div");
        summaryDiv.innerHTML = summaryHtml;
        step.appendChild(summaryDiv.firstElementChild);
      }
    });
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";

      // Reset specific modal states
      if (modalId === "checkoutModal") {
        this.currentCheckoutStep = 1;
        this.tempCart = [];
        this.goToStep(1);
      }

      if (modalId === "productModal") {
        // Reset quantity
        const qtyInput = document.getElementById("quantity");
        if (qtyInput) qtyInput.value = 1;
      }
    }
  }

  closeAllModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
    this.currentCheckoutStep = 1;
    this.tempCart = [];
  }
}

// Initialize the store
console.log("Initializing Venus Vacation Store...");
const store = new VenusVacationStore();

// Global functions for easy access
window.showProductModal = (productId) => {
  console.log("Global showProductModal called with:", productId);
  return store.showProductModal(productId);
};

// Simple global close function
window.closeModal = (modalId) => {
  console.log("Global closeModal called with:", modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    console.log("Modal closed:", modalId);

    // Reset modal states
    if (modalId === "checkoutModal" && window.store) {
      window.store.currentCheckoutStep = 1;
      window.store.tempCart = [];
    }
    if (modalId === "productModal") {
      const qtyInput = document.getElementById("quantity");
      if (qtyInput) qtyInput.value = 1;
    }
  }
};

window.store = store;

console.log("Venus Vacation Store initialized successfully!");

// Test function to verify everything is working
window.testBuyNow = () => {
  console.log("Testing Buy Now system...");
  console.log("Store instance:", store);
  console.log("Products loaded:", store.products.length);
  console.log("showProductModal function:", typeof window.showProductModal);

  if (store.products.length > 0) {
    console.log("✅ Products loaded successfully");
    console.log(
      "Available product IDs:",
      store.products.map((p) => p.id)
    );
  } else {
    console.log("❌ No products loaded");
  }
};
