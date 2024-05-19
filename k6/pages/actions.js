// @ts-check
import http from 'k6/http';

export const getProductDetails = (
    /** @type {import("k6/http").RefinedResponse<import("k6/http").ResponseType>} */ pageResponse
) => {
    return pageResponse
        .html('a:contains("Add to cart")')
        .toArray()
        .map((button) => {
            const buttonDetails = button.get(0);

            return {
                id: buttonDetails.getAttribute('data-product_id'),
                sku: buttonDetails.getAttribute('data-product_sku'),
            };
        })
        .filter((details) => details.id && details.sku);
};

export const addToCart = (
    /** @type {{ id: string; sku: string; }} */ productDetails,
    /** @type {string} */ baseUrl
) => {
    const addToCartResponse = http.post(`${baseUrl}/?wc-ajax=add_to_cart`, {
        product_id: productDetails.id,
        product_sku: productDetails.sku,
        quantity: '1',
    });

    return addToCartResponse;
};

export const updateAddress = (baseUrl, tokens, customerDetails) => {
    return http.post(
        `${baseUrl}/?wc-ajax=update_order_review`,
        Object.assign({}, customerDetails, {
            security: tokens.securityToken,
            payment_method: 'cod',
            has_full_address: 'true',
            post_data:
                Object.entries(customerDetails)
                    .map(([key, value]) => `billing_${key}=${encodeURIComponent(value)}`)
                    .join('&') +
                `&payment_method=cod&woocommerce-process-checkout-nonce=${tokens.checkoutToken}&_wp_http_referer=%2Fcheckout%2F`,
        })
    );
};

export const placeOrder = (baseUrl, tokens, customerDetails) => {
    return http.post(
        `${baseUrl}/?wc-ajax=checkout`,
        Object.assign({}, customerDetails, {
            order_comments: '',
            payment_method: 'cod',
            'woocommerce-process-checkout-nonce': tokens.checkoutToken,
            _wp_http_referer: '/?wc-ajax=update_order_review',
        })
    );
};
