import { LogEvent } from './LogEvent';

export type PartialEvent = Partial<LogEvent> & ({ message: string } | { error: Error | any } | { data: any });

export type LogMessage = string | PartialEvent | Error | Object;
