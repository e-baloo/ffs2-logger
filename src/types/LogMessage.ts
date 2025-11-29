/** biome-ignore-all lint/suspicious/noExplicitAny: use any for flexibility */
import type { LogEvent } from './LogEvent';

export type PartialEvent = Partial<LogEvent> & ({ message: string } | { error: Error | any } | { data: any });

export type LogMessage = string | PartialEvent | Error | any;
