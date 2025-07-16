/**
 * abstract class used to manage errors.
 */
export abstract class ErrorUtils {
    /**
     * Resolves the error message from the exception.
     * @param exception - The exception to resolve the error message from.
     * @returns The resolved error message.
     */
    public static resolveErrorMessage(exception: unknown): string {
        let data: Array<string> | string | null = null;
        switch (typeof exception) {
            case 'object':
                if (exception) {
                    if ('response' in exception) {
                        if (
                            exception.response &&
                            typeof exception.response === 'object' &&
                            'message' in exception.response
                        ) {
                            data = Array.isArray(exception.response.message)
                                ? exception.response.message
                                : String(exception.response.message);
                        } else {
                            data = Array.isArray(exception.response) ? exception.response : String(exception.response);
                        }
                    } else if ('message' in exception) {
                        data = Array.isArray(exception.message) ? exception.message : String(exception.message);
                    } else {
                        data = Array.isArray(exception) ? exception : null;
                    }
                    if (!data && exception instanceof Error) {
                        data = this.resolveErrorMessage(exception.cause);
                    }
                }
                break;
            case 'string':
                return exception;
        }
        if (Array.isArray(data)) {
            return data?.join(', ');
        } else if (typeof data === 'string') {
            return data;
        }
        try {
            return JSON.stringify(exception);
        } catch {
            return String(exception);
        }
    }
}
