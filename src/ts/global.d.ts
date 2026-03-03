/**
 * Global type declarations for Venus Vacation website
 */

interface Window {
  showToast?: (message: string, type: "success" | "error" | "info") => void;
  closeModal?: (modalId: string) => void;
  store?: {
    products: Array<{
      id: string;
      name: string;
      price: number;
      images?: string;
      category?: string;
      type?: string;
    }>;
  };
  videoPlayer?: any;
  cartManager?: any;
}
