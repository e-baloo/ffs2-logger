export interface ILifecycle {
    initialize(): Promise<void> | void;
    destroy(): Promise<void> | void;
    isInitialized(): Promise<boolean> | boolean;
}
