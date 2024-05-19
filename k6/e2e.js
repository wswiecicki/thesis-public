// @ts-check
import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';
import { addToCart, getProductDetails, placeOrder, updateAddress } from './pages/actions.js';
import { assert200Code, getRandomInt, extractTokens } from './helpers/helpers.js';
// @ts-ignore
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export const options = {
    vus: 80,
    iterations: 80,
};

const customerDetails = {
    first_name: 'Jan',
    last_name: 'Kowalski',
    address_1: 'ul. Miodowa 22',
    city: 'Warszawa',
    state: 'Mazowieckie',
    postcode: '00-001',
    country: 'PL',
    email: 'jan.kowalski@example.com',
    phone: '48221234567',
};

const requestDuration = new Trend('_E2E_request_duration');
const unsuccessfulRequests = new Rate('_E2E_unsuccessful_requests');

const collectAndAssert = (response, page) => {
    requestDuration.add(response.timings.duration);
    unsuccessfulRequests.add(response.status !== 200);
    assert200Code(response, page);
};

const baseUrl = __ENV.BASE_URL;

export default function () {
    const mainPageResponse = http.get(`${baseUrl}/shop/`);
    collectAndAssert(mainPageResponse, 'main page');

    const productDetails = getProductDetails(mainPageResponse);
    const randomProductDetails = productDetails[getRandomInt(0, productDetails.length)];

    // @ts-expect-error
    const addToCartResponse = addToCart(randomProductDetails, baseUrl);
    collectAndAssert(addToCartResponse, 'add to cart');

    const cartPageResponse = http.get(`${baseUrl}/cart/`);
    collectAndAssert(cartPageResponse, 'cart page');

    const checkoutPageResponse = http.get(`${baseUrl}/checkout/`);
    collectAndAssert(checkoutPageResponse, 'checkout page');

    const tokens = extractTokens(checkoutPageResponse);

    const updateAddressResponse = updateAddress(baseUrl, tokens, customerDetails);
    collectAndAssert(updateAddressResponse, 'update address');

    const receivedPageResponse = placeOrder(baseUrl, tokens, customerDetails);
    collectAndAssert(receivedPageResponse, 'order page');
}

export function handleSummary(data) {
    const transformMetrics = (data) => {
        return Object.entries(data.metrics)
            .filter(([key]) => key.startsWith('_E2E'))
            .map(([key, value]) => ({ [key]: value }));
    };

    return {
        './k6/reports/e2e-full.json': JSON.stringify(data, null, 4),
        './k6/reports/e2e-custom.json': JSON.stringify(transformMetrics(data), null, 4),
        stdout: textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
    };
}
