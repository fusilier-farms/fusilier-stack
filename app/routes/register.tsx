// @ts-nocheck
import { useState } from 'react';
import type { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import Navigation from '~/components/Navigation';

import logoRegister from '../images/register-logo.png';
import background from '../images/register_background.png';
import { formatMoney } from '~/utils';
import {createCartSession, createUserSession, getCartId, getUser} from "~/utils/sessions.server";
import {medusaAuth} from "~/utils/cookies";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export const loader: LoaderFunction = async ({ request, context }) => {
    const user = await getUser(request);
    const cartId = await getCartId(request);
    const { medusa } = context;
    const { products: membership } = await medusa.products.list({handle: 'membership'});

    if (!cartId) {
        // Create cart
        const newCart = await medusa.carts.create().then(({ cart }) => cart);
        const cartId = newCart.id;
        return createCartSession(cartId, '/register');
    }

    if (user) return redirect('/store');

    return {
        memberships: membership
    };
};

export const action: ActionFunction = async ({ request, context }) => {
    const formData = await request.formData();
    const cartId = await getCartId(request);
    const { medusa } = context;
    const { products: product } = await medusa.products.list({handle: 'membership'});

    // Form Data
    const firstName = formData.get('first-name');
    const lastName = formData.get('last-name');
    const email = formData.get('email-address');
    const password = '123456';
    const phone = formData.get('phone');
    const address1 = formData.get('address');
    const city = formData.get('city');
    const countryCode = formData.get('country');
    const postalCode = formData.get('postal-code');

    // Create customer
    const register = await medusa.customers
        .create({
            email,
            first_name: firstName,
            last_name: lastName,
            password,
            phone,
        })
        .then(({ customer, response }) => ({
            customer,
            cookie: response.headers['set-cookie'],
        }))
        .catch((err) => err);

    const { cookie } = register;
    await medusaAuth.serialize({ user: cookie });

    // Adds address to customer
    await fetch(`${process.env.BASE_URL}store/customers/me/addresses`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cookie: cookie,
        },
        body: JSON.stringify({
            address: {
                first_name: firstName,
                last_name: lastName,
                address_1: address1,
                city: city,
                country_code: countryCode,
                postal_code: postalCode,
            },
        }),
    })
        .then((res) => {
            // console.log('address', res)
        })
        .catch((err) => console.log('ERROR: ', err));

    // Add membership to cart
    await medusa.carts.lineItems.create(cartId, {
        metadata: undefined,
        quantity: 1,
        variant_id: product[0].variants[0].id,
    });
    // Create payment session
    await medusa.carts.createPaymentSessions(cartId);
    await medusa.carts.update(cartId, {
        email,
        shipping_address: {
            first_name: firstName,
            last_name: lastName,
            address_1: address1,
            city: city,
            country_code: countryCode,
            postal_code: postalCode,
        },
    });

    const shippingOptions = await medusa.shippingOptions.listCartOptions(cartId).then(({
      shipping_options
    }) => shipping_options)

    // const shipping = await medusa.sh

    // Current Shipping Method
    await medusa.carts.addShippingMethod(cartId, { option_id: shippingOptions[0].id });
    await medusa.carts.setPaymentSession(cartId, { provider_id: "paypal" });
    return createUserSession(register.customer.id, '/payment', cookie);
};

export default function Register() {
    const { memberships } = useLoaderData();

    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
        memberships[0]
    );

    return (
        <div className="pb-12" style={{
            "background-size": 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url("http://localhost:3000${background}"`,
        }}>
            <Navigation isLoggedIn={false} />
            <div className="bg-fusilier-tan container mx-auto mt-14">
                <div className="relative">
                    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                        <img
                            src={logoRegister}
                            alt=""
                            className="mx-auto mb-8"
                        />
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
                            2022 Produce Home Delivery Membership Registration
                        </h1>
                        <p className="mt-6 text-xl text-slate-800 max-w-3xl">
                            Mattis amet hendrerit dolor, quisque lorem pharetra.
                            Pellentesque lacus nisi urna, arcu sociis eu. Orci
                            vel lectus nisl eget eget ut consectetur. Sit justo
                            viverra non adipisicing elit distinctio.
                        </p>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Checkout</h2>

                    <form
                        method="post"
                        action="/register"
                        name="signup"
                        className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
                    >
                        <div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Contact information
                                </h2>

                                <div className="mt-4">
                                    <label
                                        htmlFor="email-address"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            id="email-address"
                                            required
                                            name="email-address"
                                            autoComplete="email"
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Shipping information
                                </h2>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label
                                            htmlFor="first-name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            First name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="first-name"
                                                name="first-name"
                                                autoComplete="given-name"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="last-name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Last name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="last-name"
                                                name="last-name"
                                                autoComplete="family-name"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="company"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Company
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="company"
                                                id="company"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Address
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="address"
                                                id="address"
                                                autoComplete="street-address"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="apartment"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Apartment, suite, etc.
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="apartment"
                                                id="apartment"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            City
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="city"
                                                id="city"
                                                autoComplete="address-level2"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="country"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Country
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="country"
                                                name="country"
                                                autoComplete="country-name"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="US">
                                                    United States
                                                </option>
                                                <option value="CA">
                                                    Canada
                                                </option>
                                                <option value="MX">
                                                    Mexico
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="region"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            State / Province
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="region"
                                                id="region"
                                                autoComplete="address-level1"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="postal-code"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Postal code
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="postal-code"
                                                id="postal-code"
                                                autoComplete="postal-code"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Phone
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                autoComplete="tel"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <RadioGroup
                                    value={selectedDeliveryMethod}
                                    onChange={setSelectedDeliveryMethod}
                                >
                                    <RadioGroup.Label className="text-lg font-medium text-gray-900">
                                        Membership Type:
                                    </RadioGroup.Label>

                                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        {memberships.map((membership) => (
                                            <RadioGroup.Option
                                                key={membership.id}
                                                value={membership}
                                                className={({
                                                    checked,
                                                    active,
                                                }) =>
                                                    classNames(
                                                        checked
                                                            ? 'border-transparent'
                                                            : 'border-gray-300',
                                                        active
                                                            ? 'ring-2 ring-indigo-500'
                                                            : '',
                                                        'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                                                    )
                                                }
                                            >
                                                {({ checked, active }) => (
                                                    <>
                                                        <div className="flex-1 flex">
                                                            <div className="flex flex-col">
                                                                <RadioGroup.Label
                                                                    as="span"
                                                                    className="block text-sm font-medium text-gray-900"
                                                                >
                                                                    {
                                                                        membership.title
                                                                    }
                                                                </RadioGroup.Label>
                                                                <RadioGroup.Description
                                                                    as="span"
                                                                    className="mt-1 flex items-center text-sm text-gray-500"
                                                                >
                                                                    {
                                                                        membership.description
                                                                    }
                                                                </RadioGroup.Description>
                                                                <RadioGroup.Description
                                                                    as="span"
                                                                    className="mt-6 text-sm font-medium text-gray-900"
                                                                >
                                                                    {formatMoney(
                                                                        membership
                                                                            .variants[0]
                                                                            .prices[0]
                                                                            .amount
                                                                    )}
                                                                </RadioGroup.Description>
                                                            </div>
                                                        </div>
                                                        {checked ? (
                                                            <CheckCircleIcon
                                                                className="h-5 w-5 text-indigo-600"
                                                                aria-hidden="true"
                                                            />
                                                        ) : null}
                                                        <div
                                                            className={classNames(
                                                                active
                                                                    ? 'border'
                                                                    : 'border-2',
                                                                checked
                                                                    ? 'border-indigo-500'
                                                                    : 'border-transparent',
                                                                'absolute -inset-px rounded-lg pointer-events-none'
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                )}
                                            </RadioGroup.Option>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-900 hover:bg-emerald-700"
                            >
                                Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
