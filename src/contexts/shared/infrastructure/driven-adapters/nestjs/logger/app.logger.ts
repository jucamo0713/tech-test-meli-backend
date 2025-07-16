import { ConsoleLogger, Injectable } from '@nestjs/common';
import { AsyncRequestContext } from '@shared/domain/model/async-request-context';

/**
 * Custom logger that automatically includes the PID from the request headers.
 */
@Injectable()
export class AppLogger extends ConsoleLogger {
    /**
     * Logs a message at the 'log' level.
     * @param message - The message to log.
     * @param [context] - The context of the message.
     */
    log(message: string, context?: string) {
        super.log(message, this.formatContextWithPid(context));
    }

    /**
     * Logs a message at the 'error' level.
     * @param message - The error message to log.
     * @param [trace] - The stack trace of the error.
     * @param [context] - The context of the message.
     */
    error(message: string, trace?: string, context?: string) {
        super.error(message, trace, this.formatContextWithPid(context));
    }

    /**
     * Logs a message at the 'warn' level.
     * @param message - The warning message to log.
     * @param [context] - The context of the message.
     */
    warn(message: string, context?: string) {
        super.warn(message, this.formatContextWithPid(context));
    }

    /**
     * Logs a message at the 'debug' level.
     * @param message - The debug message to log.
     * @param [context] - The context of the message.
     */
    debug(message: string, context?: string) {
        super.debug(message, this.formatContextWithPid(context));
    }

    /**
     * Logs a message at the 'verbose' level.
     * @param message - The verbose message to log.
     * @param [context] - The context of the message.
     */
    verbose(message: string, context?: string) {
        super.verbose(message, this.formatContextWithPid(context));
    }

    /**
     * Formats the context by appending the PID from the request headers.
     * @param [context] - The context to format.
     * @returns The formatted context.
     */
    protected formatContextWithPid(context?: string): string | undefined {
        const pid = AsyncRequestContext.get('pid');
        if (pid) {
            return this.context || context ? `${context ?? this.context}] [PID: ${pid}` : `PID: ${pid}`;
        }
        return this.context || context ? (context ?? this.context) : undefined;
    }
}
