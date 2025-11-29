import type { IConsolePrinter } from '../../interfaces/console/IConsolePrinter';

export class ConsolePrinter implements IConsolePrinter {
    print(
        message: string,
        data: string | null,
        error: string | null,
        writeStreamType: 'stdout' | 'stderr' = 'stdout'
    ): void {
        process[writeStreamType].write(message);
        if (data) {
            process.stdout.write(data);
        }
        if (error) {
            process.stderr.write(error);
        }
    }
}
