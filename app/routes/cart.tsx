// @ts-nocheck
import {
    CheckIcon,
    ClockIcon,
    QuestionMarkCircleIcon,
    XIcon,
} from '@heroicons/react/solid';
import Navigation from '~/components/Navigation';
import Footer from '~/components/Footer';
import FooterSocial from '~/components/FooterSocial';
import { useLoaderData} from '@remix-run/react';
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { formatMoney } from '../utils/index';
import {getCartId, getUser} from "~/utils/sessions.server";

export const loader: LoaderFunction = async ({ request, context }) => {
    const { medusa } = context;
    const cartId = await getCartId(request);
    const user = await getUser(request);
    const {cart} = await medusa.carts.retrieve(cartId);

    return {
        isLoggedIn: user,
        cart: cart,
        products: cart.items
    };
};

export const action: ActionFunction = async ({ request, context }) => {
    const { medusa } = context;
    const formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);
    const cartId = await getCartId(request);

    if (_action === 'removeItem') {
        return await medusa.carts.lineItems.delete(cartId, values.productId);
    }
}

export default function Cart() {
    const { isLoggedIn, products, cart } = useLoaderData();

    return (
        <div className="bg-white">
            <Navigation isLoggedIn={isLoggedIn} />
            <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Shopping Cart
                </h1>
                <form action='/payment?cart=true' method="post" className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                    <section
                        aria-labelledby="cart-heading"
                        className="lg:col-span-7"
                    >
                        <h2 id="cart-heading" className="sr-only">
                            Items in your shopping cart
                        </h2>

                        <ul
                            role="list"
                            className="border-t border-b border-gray-200 divide-y divide-gray-200"
                        >
                            {products.map((product) => (
                                <li
                                    key={product.id}
                                    className="flex py-6 sm:py-10"
                                >
                                    {console.log('PRODUCT', product)}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.imageAlt}
                                            className="w-14 h-14 rounded-md object-center object-cover sm:w-14 sm:h-14"
                                        />
                                    </div>

                                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <p
                                                            className="font-medium text-gray-700 hover:text-gray-800"
                                                        >
                                                            {product.title}
                                                        </p>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex text-sm">
                                                    <p className="text-gray-500">
                                                        {product.color}
                                                    </p>
                                                    {product.size ? (
                                                        <p className="ml-4 pl-4 border-l border-gray-200 text-gray-500">
                                                            {product.size}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {formatMoney(product.unit_price)}
                                                </p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <p>Quantity: <span>{product.quantity}</span></p>
                                                <div className="absolute top-0 right-0">
                                                    <form
                                                        method="post"
                                                    >
                                                        <input type="hidden" name="productId" value={product.id} />
                                                        <button
                                                            type="submit"
                                                            name="_action"
                                                            value="removeItem"
                                                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                                        >
                                                            <span className="sr-only">
                                                                Remove
                                                            </span>
                                                            <XIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Order summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                    >
                        <h2
                            id="summary-heading"
                            className="text-lg font-medium text-gray-900"
                        >
                            Order summary
                        </h2>

                        <dl className="mt-6 space-y-4">
                            <div>Items: </div>
                            {products.map(product => (
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">{product.title} <span className="text-sm text-black font-medium">x{product.quantity}</span></dt>
                                    <dd className="text-sm font-medium text-gray-900">{formatMoney((product.unit_price * product.quantity))}</dd>
                                </div>
                            ))}
                            <div className="border border-t" />
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">
                                    Subtotal
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {formatMoney(cart.subtotal)}
                                </dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="flex items-center text-sm text-gray-600">
                                    <span>Shipping estimate</span>
                                    <a
                                        href="#"
                                        className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">
                                            Learn more about how shipping is
                                            calculated
                                        </span>
                                        <QuestionMarkCircleIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {formatMoney(cart.shipping_total)}
                                </dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="flex text-sm text-gray-600">
                                    <span>Tax estimate</span>
                                    <a
                                        href="#"
                                        className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">
                                            Learn more about how tax is
                                            calculated
                                        </span>
                                        <QuestionMarkCircleIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {formatMoney(cart.shipping_total)}
                                </dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-base font-medium text-gray-900">
                                    Order total
                                </dt>
                                <dd className="text-base font-medium text-gray-900">
                                    {formatMoney(cart.total)}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                            >
                                Checkout
                            </button>
                        </div>
                    </section>
                </form>
            </div>
            <Footer />
            <FooterSocial />
        </div>
    );
}
