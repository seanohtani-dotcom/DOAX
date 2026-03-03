interface VideoError {
    code: number;
    message: string;
    element: HTMLVideoElement;
}
declare class VideoPlayer {
    private videos;
    private errorHandlers;
    constructor();
    /**
     * Initialize all video elements on the page
     */
    private init;
    /**
     * Setup all video elements with proper event handlers
     */
    private setupVideos;
    /**
     * Setup event handlers for a single video element
     */
    private setupVideoHandlers;
    /**
     * Toggle play/pause for a video
     */
    togglePlayPause(videoId: string): Promise<void>;
    /**
     * Play a video with proper error handling
     */
    play(videoId: string): Promise<void>;
    /**
     * Pause a video
     */
    pause(videoId: string): void;
    /**
     * Handle video loading errors
     */
    private handleVideoError;
    /**
     * Get human-readable error message from error code
     */
    private getErrorMessage;
    /**
     * Show error message to user
     */
    private showUserError;
    /**
     * Update video UI based on state
     */
    private updateVideoUI;
    /**
     * Register custom error handler for a video
     */
    onError(videoId: string, handler: (error: VideoError) => void): void;
    /**
     * Get video element by ID
     */
    getVideo(videoId: string): HTMLVideoElement | undefined;
    /**
     * Get all video IDs
     */
    getVideoIds(): string[];
}
export declare const videoPlayer: VideoPlayer;
export {};
//# sourceMappingURL=video-player.d.ts.map