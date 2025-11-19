import { LogEvent } from "../types/LogEvent";


const isEmojiAllowed = (): boolean => !process.env.NO_EMOJI;

export interface IEmojiFormatter {
    formatEmoji(event: LogEvent): string;
}

export class EmojiFormatter implements IEmojiFormatter {

    formatEmoji(event: LogEvent): string {

        if (!isEmojiAllowed()) {
            return '';
        }

        switch (event.level) {
            case 'trace':
                return '🔍';
            case 'debug':
                return '🐛';
            case 'info':
            case 'log':
                return '✅';
            case 'warn':
                return '⚠️ ';
            case 'error':
            case 'httpError':
                return '❌';
            case 'fatal':
                return '💀';
            case 'http':
                return '🌐';
            case 'data':
                return '📄';
            case 'verbose':
                return '🗣 ';
            case 'silly':
                return '🤪';
            default:
                return '';
        }
    }
}