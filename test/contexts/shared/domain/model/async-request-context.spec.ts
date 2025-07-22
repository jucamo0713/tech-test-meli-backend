import { AsyncRequestContext } from '@shared/domain/model/async-request-context';

describe('AsyncRequestContext', () => {
    const initialContext = { pid: '1234' };

    it('should set and get full context correctly', () => {
        let capturedContext;
        AsyncRequestContext.setData(initialContext, () => {
            capturedContext = AsyncRequestContext.getData();
        });
        expect(capturedContext).toEqual(initialContext);
    });

    it('should get specific value from context', () => {
        let pidValue;
        AsyncRequestContext.setData(initialContext, () => {
            pidValue = AsyncRequestContext.get('pid');
        });
        expect(pidValue).toBe('1234');
    });

    it('should allow modifying context value via setDataForCurrentContext', () => {
        let updatedPid;
        AsyncRequestContext.setData(initialContext, () => {
            AsyncRequestContext.setDataForCurrentContext('pid', '5678');
            updatedPid = AsyncRequestContext.get('pid');
        });
        expect(updatedPid).toBe('5678');
    });

    it('should throw error if setDataForCurrentContext is called outside of context', () => {
        expect(() => {
            AsyncRequestContext.setDataForCurrentContext('pid', 'nope');
        }).toThrow('No context set. Use setData to set the context first.');
    });

    it('should return undefined for getData if no context is set', () => {
        const result = AsyncRequestContext.getData();
        expect(result).toBeUndefined();
    });

    it('should return undefined for get(key) if no context is set', () => {
        const result = AsyncRequestContext.get('pid');
        expect(result).toBeUndefined();
    });
});
