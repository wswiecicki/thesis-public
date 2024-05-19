// @ts-check
import http from 'k6/http';
import { Trend, Counter, Rate } from 'k6/metrics';
import { addToCart, getProductDetails } from './pages/actions.js';
import { check, fail, sleep } from 'k6';
import { getRandomInt } from './helpers/helpers.js';

export const options = {
    vus: 10,
    duration: '15m',
};

const timeBetween = 2;

const responseTimeMetric = new Trend('_CART_response_time');
const tcpConnectionTimeMetric = new Trend('_CART_tcp_connection_time');
const responseReceiveTimeMetric = new Trend('_CART_response_receive_time');
const totalRequests = new Counter('_CART_total_requests');
const totalReceivedBytes = new Counter('_CART_total_received_bytes');
const successRate = new Rate('_CART_success_rate');
const positiveAssertionsRate = new Rate('_CART_positive_assertions');

const baseUrl = __ENV.BASE_URL;
export function setup() {
    const mainPageResponse = http.get(`${baseUrl}/shop/`);
    if (
        !check(mainPageResponse, {
            'status code 200': (r) => r.status === 200,
        })
    )
        fail();
    return getProductDetails(mainPageResponse);
}

/**
 * @param {{ id: string; sku: string; }[]} productDetails
 */
export default function (productDetails) {
    const randomProductDetails = productDetails[getRandomInt(0, productDetails.length)];
    const addToCartResponse = addToCart(randomProductDetails, baseUrl);
    try {
        positiveAssertionsRate.add(
            check(addToCartResponse, {
                'status is 200': (r) => r.status === 200,
                // @ts-ignore
                'response is not empty': (r) => r.body.length > 0,
            })
        );
        console.log('Added ' + JSON.stringify(randomProductDetails) + ' to cart');
        responseTimeMetric.add(addToCartResponse.timings.duration);
        tcpConnectionTimeMetric.add(addToCartResponse.timings.connecting);
        responseReceiveTimeMetric.add(addToCartResponse.timings.receiving);
        totalRequests.add(1);
        // @ts-ignore
        totalReceivedBytes.add(addToCartResponse.body.length);
        successRate.add(addToCartResponse.status === 200);
    } catch (e) {
        positiveAssertionsRate.add(false);
        console.log(e);
        sleep(timeBetween);
        fail();
    }

    sleep(timeBetween);
}

export function handleSummary(data) {
    const transformMetrics = (data) => {
        return Object.entries(data.metrics)
            .filter(([key]) => key.startsWith('_CART'))
            .map(([key, value]) => ({ [key]: value }));
    };

    return {
        './k6/reports/cart-full.json': JSON.stringify(data, null, 4),
        './k6/reports/cart-custom.json': JSON.stringify(transformMetrics(data), null, 4),
    };
}
