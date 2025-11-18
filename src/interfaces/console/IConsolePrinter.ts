export interface IConsolePrinter {
    print(message: string, data: string | null, error: string | null, writeStreamType?: 'stdout' | 'stderr'): void;
}