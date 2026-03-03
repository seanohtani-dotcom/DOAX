interface VideoError {
  code: number;
  message: string;
  element: HTMLVideoElement;
}

class VideoPlayer {
  private videos: Map<string, HTMLVideoElement> = new Map();
  private errorHandlers: Map<string, (error: VideoError) => void> = new Map();

  constructor() {
    this.init();
  }

  /**
   * Initialize all video elements on the page
   */
  private init(): void {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupVideos());
    } else {
      this.setupVideos();
    }
  }

  /**
   * Setup all video elements with proper event handlers
   */
  private setupVideos(): void {
    const videoElements =
      document.querySelectorAll<HTMLVideoElement>(".movie-thumbnail");

    if (videoElements.length === 0) {
      console.warn("No video elements found with class .movie-thumbnail");
      return;
    }

    videoElements.forEach((video, index) => {
      const videoId = video.id || `video-${index}`;
      video.id = videoId;

      this.videos.set(videoId, video);
      this.setupVideoHandlers(video, videoId);
    });

    console.log(`✅ Initialized ${this.videos.size} video players`);
  }

  /**
   * Setup event handlers for a single video element
   */
  private setupVideoHandlers(video: HTMLVideoElement, videoId: string): void {
    // Validate video element
    if (!video || !(video instanceof HTMLVideoElement)) {
      console.error(`Invalid video element for ID: ${videoId}`);
      return;
    }

    // Loaded metadata event
    video.addEventListener("loadedmetadata", () => {
      console.log(`📹 Video loaded: ${video.src || "unknown source"}`);
      this.updateVideoUI(video, "loaded");
    });

    // Error handling
    video.addEventListener("error", (event) => {
      this.handleVideoError(video, videoId, event);
    });

    // Play event
    video.addEventListener("play", () => {
      console.log(`▶️ Video playing: ${videoId}`);
      this.updateVideoUI(video, "playing");
    });

    // Pause event
    video.addEventListener("pause", () => {
      console.log(`⏸️ Video paused: ${videoId}`);
      this.updateVideoUI(video, "paused");
    });

    // Click handler for play/pause toggle
    video.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await this.togglePlayPause(videoId);
    });

    // Parent element click handler
    const parent = video.parentElement;
    if (parent) {
      parent.addEventListener("click", async (event) => {
        if (event.target !== video) {
          event.preventDefault();
          await this.togglePlayPause(videoId);
        }
      });
    }

    // Keyboard accessibility
    video.setAttribute("tabindex", "0");
    video.addEventListener("keydown", async (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        await this.togglePlayPause(videoId);
      }
    });
  }

  /**
   * Toggle play/pause for a video
   */
  public async togglePlayPause(videoId: string): Promise<void> {
    const video = this.videos.get(videoId);

    if (!video) {
      console.error(`Video not found: ${videoId}`);
      return;
    }

    try {
      if (video.paused) {
        await this.play(videoId);
      } else {
        this.pause(videoId);
      }
    } catch (error) {
      console.error(`Error toggling video ${videoId}:`, error);
      this.showUserError(video, "Unable to play video. Please try again.");
    }
  }

  /**
   * Play a video with proper error handling
   */
  public async play(videoId: string): Promise<void> {
    const video = this.videos.get(videoId);

    if (!video) {
      throw new Error(`Video not found: ${videoId}`);
    }

    try {
      // Check if video source is valid
      if (!video.src && video.children.length === 0) {
        throw new Error("No video source specified");
      }

      await video.play();
      console.log(`✅ Video playing: ${videoId}`);
    } catch (error) {
      if (error instanceof DOMException) {
        // Handle specific DOMException errors
        switch (error.name) {
          case "NotAllowedError":
            console.warn(
              "Autoplay blocked by browser. User interaction required.",
            );
            this.showUserError(video, "Click to play video");
            break;
          case "NotSupportedError":
            console.error("Video format not supported");
            this.showUserError(video, "Video format not supported");
            break;
          case "AbortError":
            console.warn("Video playback aborted");
            break;
          default:
            console.error("Playback error:", error.message);
            this.showUserError(video, "Unable to play video");
        }
      } else {
        console.error("Unexpected playback error:", error);
        this.showUserError(video, "An error occurred");
      }
      throw error;
    }
  }

  /**
   * Pause a video
   */
  public pause(videoId: string): void {
    const video = this.videos.get(videoId);

    if (!video) {
      console.error(`Video not found: ${videoId}`);
      return;
    }

    video.pause();
    console.log(`⏸️ Video paused: ${videoId}`);
  }

  /**
   * Handle video loading errors
   */
  private handleVideoError(
    video: HTMLVideoElement,
    videoId: string,
    event: Event,
  ): void {
    const error: VideoError = {
      code: video.error?.code || 0,
      message: this.getErrorMessage(video.error?.code || 0),
      element: video,
    };

    console.error(`❌ Video error (${videoId}):`, error.message);
    console.error("Error details:", {
      code: error.code,
      src: video.src,
      networkState: video.networkState,
      readyState: video.readyState,
    });

    this.showUserError(video, error.message);

    // Call custom error handler if registered
    const handler = this.errorHandlers.get(videoId);
    if (handler) {
      handler(error);
    }
  }

  /**
   * Get human-readable error message from error code
   */
  private getErrorMessage(code: number): string {
    const errorMessages: Record<number, string> = {
      1: "Video loading aborted",
      2: "Network error while loading video",
      3: "Video decoding failed",
      4: "Video format not supported",
    };

    return errorMessages[code] || "Unknown video error";
  }

  /**
   * Show error message to user
   */
  private showUserError(video: HTMLVideoElement, message: string): void {
    const parent = video.parentElement;
    if (!parent) return;

    // Remove existing error messages
    const existingError = parent.querySelector(".video-error");
    if (existingError) {
      existingError.remove();
    }

    // Create error message element
    const errorDiv = document.createElement("div");
    errorDiv.className = "video-error";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      background: rgba(0, 0, 0, 0.8);
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      z-index: 10;
      pointer-events: none;
      font-size: 14px;
      max-width: 80%;
    `;

    parent.style.position = "relative";
    parent.appendChild(errorDiv);

    // Auto-remove error after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  /**
   * Update video UI based on state
   */
  private updateVideoUI(
    video: HTMLVideoElement,
    state: "loaded" | "playing" | "paused",
  ): void {
    const parent = video.parentElement;
    if (!parent) return;

    // Remove existing state classes
    parent.classList.remove("video-loaded", "video-playing", "video-paused");

    // Add current state class
    parent.classList.add(`video-${state}`);
  }

  /**
   * Register custom error handler for a video
   */
  public onError(videoId: string, handler: (error: VideoError) => void): void {
    this.errorHandlers.set(videoId, handler);
  }

  /**
   * Get video element by ID
   */
  public getVideo(videoId: string): HTMLVideoElement | undefined {
    return this.videos.get(videoId);
  }

  /**
   * Get all video IDs
   */
  public getVideoIds(): string[] {
    return Array.from(this.videos.keys());
  }
}

// Export singleton instance
export const videoPlayer = new VideoPlayer();

// Make available globally for non-module scripts
if (typeof window !== "undefined") {
  (window as any).videoPlayer = videoPlayer;
}
