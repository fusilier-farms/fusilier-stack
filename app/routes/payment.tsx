// @ts-nocheck
import { ClientOnly } from 'remix-utils';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useLoaderData} from '@remix-run/react';
import { ActionFunction, LoaderFunction } from '@remix-run/node';

import PayPal from '~/components/PayPal';
import Navigation from '~/components/Navigation';
import FooterSocial from '~/components/FooterSocial';
import Footer from '~/components/Footer';

import {destroyCartSession, getCartId, getUser} from "~/utils/sessions.server";
import {formatMoney} from "~/utils";


export const loader: LoaderFunction = async ({ request, context }) => {
    const { medusa } = context;
    const user = await getUser(request);
    const cartId = await getCartId(request);
    const {cart} = await medusa.carts.retrieve(cartId);

    return {
        products: cart.items,
        isLoggedIn: user,
        paymentSession: cart.payment_session?.data?.id,
        total: cart.total,
        cart
    };
};

export const action: ActionFunction = async ({ request, context }) => {
    const { medusa } = context;
    const cartId = await getCartId(request);
    const url = new URL(request.url);
    const isCart = url.searchParams.get('cart');

    if (isCart) {
        console.log('isCart');
        await medusa.carts.createPaymentSessions(cartId);
        await medusa.carts.setPaymentSession(cartId, { provider_id: "paypal" });
        await medusa.carts.update(cartId, {
            email: 'jcbrmn06@gmail.com',
            shipping_address: {
                first_name: 'Jacob',
                last_name: 'Roman',
                address_1: '2808 Sycamore River',
                city: 'Fowlerville',
                country_code: 'US',
                postal_code: '48836',
            },
        });
        // Current Shipping Method - so_01FXBT8RNTV26B00D2K2A70T6M
        await medusa.carts.addShippingMethod(cartId, { option_id: 'so_01FXBT8RNTV26B00D2K2A70T6M' });
        return 'OK';
    }

    console.log('COMPLETE', cartId);
    // Complete cart
    const order = await medusa.carts
        .complete(cartId)
        .then(({ data: order }) => order);
    // console.log('order', order);

    if (order) {
        // Set cookie with order
        return destroyCartSession('/thank-you', order.id);
    }

    // return error
    return 'OK'
}

export default function Payment() {
    const { total, paymentSession, isLoggedIn, products, cart } = useLoaderData();
    console.log('cart', cart);
    return (
        <>
            <ClientOnly>
                <Navigation isLoggedIn={isLoggedIn} />
                <PayPalScriptProvider
                    options={{
                        'client-id': 'test',
                        components: 'buttons',
                        currency: 'USD',
                        intent: "authorize",
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                            <div className="max-w-xl">
                                <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                                   Payment
                                </h1>
                                <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                                    We are almost there!
                                </p>
                                <p className="mt-2 text-base text-gray-500">
                                    Below is your order overview and where you make your payment
                                </p>
                            </div>

                            <div className="mt-10 border-t border-gray-200">
                                <h2 className="sr-only">Your order</h2>

                                <h3 className="sr-only">Items</h3>
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="py-10 border-b border-gray-200 flex space-x-6"
                                    >
                                        <img
                                            src={product.thumbnail}
                                            alt={product.description}
                                            className="flex-none w-20 h-20 object-center object-cover bg-gray-100 rounded-lg sm:w-20 sm:h-20"
                                        />
                                        <div className="flex-auto flex flex-col">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {product.title}
                                                </h4>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {product.description}
                                                </p>
                                            </div>
                                            <div className="mt-6 flex-1 flex items-end">
                                                <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                                                    <div className="flex">
                                                        <dt className="font-medium text-gray-900">
                                                            Quantity
                                                        </dt>
                                                        <dd className="ml-2 text-gray-700">
                                                            {product.quantity}
                                                        </dd>
                                                    </div>
                                                    <div className="pl-4 flex sm:pl-6">
                                                        <dt className="font-medium text-gray-900">
                                                            Price
                                                        </dt>
                                                        <dd className="ml-2 text-gray-700">
                                                            {formatMoney(product.unit_price)}
                                                        </dd>
                                                    </div>
                                                    <div className="pl-4 flex sm:pl-6">
                                                        <dt className="font-medium text-gray-900">
                                                            Total
                                                        </dt>
                                                        <dd className="ml-2 text-gray-700">
                                                            {formatMoney((product.unit_price * product.quantity))}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="sm:ml-40 sm:pl-6">
                                    <h3 className="sr-only">Your information</h3>

                                    <h4 className="sr-only">Addresses</h4>
                                    <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
                                        <div>
                                            <dt className="font-medium text-gray-900">
                                                Shipping address
                                            </dt>
                                            <dd className="mt-2 text-gray-700">
                                                <address className="not-italic">
                                        <span className="block">
                                            Kristin Watson
                                        </span>
                                                    <span className="block">
                                            7363 Cynthia Pass
                                        </span>
                                                    <span className="block">
                                            Toronto, ON N3Y 4H8
                                        </span>
                                                </address>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-900">
                                                Billing address
                                            </dt>
                                            <dd className="mt-2 text-gray-700">
                                                <address className="not-italic">
                                        <span className="block">
                                            Kristin Watson
                                        </span>
                                                    <span className="block">
                                            7363 Cynthia Pass
                                        </span>
                                                    <span className="block">
                                            Toronto, ON N3Y 4H8
                                        </span>
                                                </address>
                                            </dd>
                                        </div>
                                    </dl>

                                    <h4 className="sr-only">Payment</h4>
                                    <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 text-sm py-10">
                                        <div>
                                            <dt className="font-medium text-gray-900">
                                                Payment method
                                            </dt>
                                            <dd className="mt-2 text-gray-700">
                                                <p>PayPal</p>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-900">
                                                Shipping method
                                            </dt>
                                            <dd className="mt-2 text-gray-700">
                                                <p>Free Shipping</p>
                                            </dd>
                                        </div>
                                    </dl>

                                    <h3 className="sr-only">Summary</h3>

                                    <dl className="space-y-6 border-t border-gray-200 text-sm pt-10">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-900">
                                                Subtotal
                                            </dt>
                                            <dd className="text-gray-700">{formatMoney(cart.subtotal)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="flex font-medium text-gray-900">
                                                Discount
                                                <span className="rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 ml-2">
                                        STUDENT50
                                    </span>
                                            </dt>
                                            <dd className="text-gray-700">-$18.00 (50%)</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-900">
                                                Shipping
                                            </dt>
                                            <dd className="text-gray-700">$0.00</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-900">
                                                Total
                                            </dt>
                                            <dd className="text-gray-900">{formatMoney(cart.total)}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            <form className="mt-6" action="/payment" id="payment" method="post" name="payment">
                                <PayPal amount={total} paymentSession={paymentSession} />
                            </form>
                        </div>
                    </div>
                </PayPalScriptProvider>
                <Footer />
                <FooterSocial />
            </ClientOnly>
        </>
    );
}
