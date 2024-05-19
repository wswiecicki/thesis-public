// @ts-check
import { check, fail } from 'k6';
// @ts-ignore
import { findBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

export const getRandomInt = (/** @type {number} */ min, /** @type {number} */ max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

export const assert200Code = (response, page) => {
    if (!check(response, { 'status code 200': (r) => r.status === 200 })) {
        fail('Failed to load ' + page);
    }
};

export const extractTokens = (response) => {
    const securityToken = findBetween(response.body, 'update_order_review_nonce":"', '"');
    const checkoutToken = response.html('#woocommerce-process-checkout-nonce').val();
    if (!securityToken || !checkoutToken) fail();

    return { securityToken, checkoutToken };
};
