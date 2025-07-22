import { ErrorUtils } from '@shared/domain/usecase/utils/error.utils';

describe('ErrorUtils.resolveErrorMessage', () => {
    it('should return message from exception.response.message (string)', () => {
        const ex = { response: { message: 'Not found' } };
        expect(ErrorUtils.resolveErrorMessage(ex)).toBe('Not found');
    });

    it('should return message from exception.response.message (array)', () => {
        const ex = { response: { message: ['Error 1', 'Error 2'] } };
        expect(ErrorUtils.resolveErrorMessage(ex)).toBe('Error 1, Error 2');
    });

    it('should return stringified exception.response if no message key (string)', () => {
        const ex = { response: 'Server error' };
        expect(ErrorUtils.resolveErrorMessage(ex)).toBe('Server error');
    });

    it('should return joined string if exception.response is array', () => {
        const ex = { response: ['Err1', 'Err2'] };
        expect(ErrorUtils.resolveErrorMessage(ex)).toBe('Err1, Err2');
    });

    it('should return message from exception.message (string)', () => {
        const ex = { message: 'Simple message' };
        expect(ErrorUtils.resolveErrorMessage(ex)).toBe('Simple message');
    });

    it('should return joined message if exception.message is array', () => {
        const ex = { message: ['One', 'Two'] };
        expect(ErrorUtils.resolveErrorMessage(ex)).toBe('One, Two');
    });

    it('should return string if exception is a string', () => {
        expect(ErrorUtils.resolveErrorMessage('just a string')).toBe('just a string');
    });

    it('should stringify unknown object', () => {
        const ex = { foo: 'bar' };
        expect(ErrorUtils.resolveErrorMessage(ex)).toBe(JSON.stringify(ex));
    });

    it('should return String(exception) if JSON.stringify fails', () => {
        const circular: Record<string, unknown> = {};
        circular.self = circular;
        const result = ErrorUtils.resolveErrorMessage(circular);
        expect(result).toBe('[object Object]'); // String(circular)
    });

    it('should return empty string for null or empty object', () => {
        expect(ErrorUtils.resolveErrorMessage({})).toBe('{}');
        expect(ErrorUtils.resolveErrorMessage(null)).toBe('null');
    });
});
