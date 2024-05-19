import { render, screen } from '@testing-library/react';
import { RouteTracker } from '../../connect-four-react/src/components/RouteTracker';
import * as fc from 'fast-check';
import { test, expect, vi } from 'vitest';
import { Provider } from 'react-redux';

const mockRouterProps = {
    connectFour: {
        history: {
            past: [],
        },
    },
    location: {
        pathname: '/',
    },
};

const gameStateArbitrary: fc.Arbitrary<{ past: number[] }> = fc
    .array(fc.integer({ min: 0, max: 6 }), { minLength: 1, maxLength: 42 })
    .map((past) => ({ past }));

const mockStore = {
    getState: vi.fn(() => ({ connectFour: { history: { past: [] } } })),
    subscribe: vi.fn(),
};

test('should correctly serialize and deserialize game state', () => {
    fc.assert(
        fc.property(gameStateArbitrary, (gameState) => {
            const serializedState = RouteTracker['serializeState'](gameState.past);
            const parsedState = RouteTracker['parseState'](serializedState);
            expect(parsedState.columns.reverse()).toEqual(gameState.past);
        })
    );
});

test('should redirect to the correct location when game state changes', () => {
    fc.assert(
        fc.property(gameStateArbitrary, (gameState) => {
            const replyAll = vi.fn();
            const wrapper = render(
                <Provider store={mockStore as any}>
                    <RouteTracker {...mockRouterProps} />
                </Provider>
            );

            const mockNewRouterProps = {
                ...mockRouterProps,
                replayAll: replyAll,
                location: {
                    pathname: RouteTracker['serializeState'](gameState.past),
                },
            };

            wrapper.rerender(<RouteTracker {...mockNewRouterProps} />);

            expect(replyAll).toBeCalledWith(gameState.past);
        })
    );
});
