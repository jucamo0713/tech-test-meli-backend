import { Command, CommandBus, EventBus, IEvent, Query, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { NestCqrsCaller } from '@shared/infrastructure/driven-adapters/nestjs/cqrs/nest-cqrs-caller.service';

/**
 * A service that provides a unified interface for dispatching commands, emitting events, and executing queries.
 */
class TestCommand extends Command<unknown> {
    /**
     * @param payload - The payload for the command.
     */
    constructor(public readonly payload: unknown) {
        super();
    }
}

/**
 * A test query class.
 */
class TestQuery extends Query<unknown> {
    /**
     * @param criteria - The criteria for the query.
     */
    constructor(public readonly criteria: unknown) {
        super();
    }
}

/**
 * A test event class.
 */
class TestEvent implements IEvent {
    /**
     * @param data - The data for the event.
     */
    constructor(public readonly data: unknown) {}
}

describe('NestCqrsCaller', () => {
    let dispatcher: Partial<CommandBus>;
    let consultant: Partial<QueryBus>;
    let emitter: Partial<EventBus>;
    let cqrsCaller: NestCqrsCaller;

    beforeEach(() => {
        dispatcher = { execute: jest.fn() };
        consultant = { execute: jest.fn() };
        emitter = { publish: jest.fn() };
        cqrsCaller = new NestCqrsCaller(dispatcher as CommandBus, consultant as QueryBus, emitter as EventBus);
        jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('dispatch', () => {
        it('should dispatch a command and log appropriately', async () => {
            const command = new TestCommand({ value: 42 });
            const result = { success: true };
            (dispatcher.execute as jest.Mock).mockResolvedValue(result);

            const response = await cqrsCaller.dispatch(command, {
                showCommand: true,
                showLogs: true,
                showResult: true,
            });

            expect(dispatcher.execute).toHaveBeenCalledWith(command);
            expect(response).toEqual(result);
            expect(Logger.prototype.log).toHaveBeenCalledTimes(2);
        });

        it('should suppress logs if showLogs is false', async () => {
            const command = new TestCommand({});
            (dispatcher.execute as jest.Mock).mockResolvedValue('done');

            await cqrsCaller.dispatch(command, {
                showCommand: true,
                showLogs: false,
                showResult: true,
            });

            expect(Logger.prototype.log).not.toHaveBeenCalled();
        });
    });

    describe('emit', () => {
        it('should emit an event and log appropriately', async () => {
            const event = new TestEvent({ key: 'value' });

            await cqrsCaller.emit(event, {
                showEvent: true,
                showLogs: true,
            });

            expect(emitter.publish).toHaveBeenCalledWith(event);
            expect(Logger.prototype.log).toHaveBeenCalledTimes(2);
        });

        it('should suppress logs if showLogs is false', async () => {
            const event = new TestEvent({ key: 'value' });

            await cqrsCaller.emit(event, {
                showEvent: true,
                showLogs: false,
            });

            expect(Logger.prototype.log).not.toHaveBeenCalled();
        });
    });

    describe('query', () => {
        it('should execute a query and log appropriately', async () => {
            const query = new TestQuery({ id: 123 });
            const result = { data: 'info' };
            (consultant.execute as jest.Mock).mockResolvedValue(result);

            const response = await cqrsCaller.query(query, {
                showLogs: true,
                showQuery: true,
                showResult: true,
            });

            expect(consultant.execute).toHaveBeenCalledWith(query);
            expect(response).toEqual(result);
            expect(Logger.prototype.log).toHaveBeenCalledTimes(2);
        });

        it('should suppress logs if showLogs is false', async () => {
            const query = new TestQuery({});
            (consultant.execute as jest.Mock).mockResolvedValue('queryResult');

            await cqrsCaller.query(query, {
                showLogs: false,
                showQuery: true,
                showResult: true,
            });

            expect(Logger.prototype.log).not.toHaveBeenCalled();
        });
    });

    describe('safeStringify', () => {
        it('should stringify valid object', () => {
            const obj = { a: 1, b: 2 };
            const result = cqrsCaller['safeStringify'](obj);
            expect(result).toBe(JSON.stringify(obj));
        });

        it('should return fallback for circular reference', () => {
            const a: Record<string, unknown> = {};
            a.self = a;
            const result = cqrsCaller['safeStringify'](a);
            expect(result).toBe('[Unserializable Object]');
        });
    });
});
