import { Fragment } from 'react';
import { LoaderFunction, redirect, ActionFunction } from '@remix-run/node';
import { useLoaderData, useActionData } from '@remix-run/react'
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FilterIcon } from '@heroicons/react/solid';
import Navigation from '~/components/Navigation';
import Footer from '~/components/Footer';
import FooterSocial from '~/components/FooterSocial';
import {formatMoney} from "~/utils";
import {createCartSession, getCartId, getUser} from "~/utils/sessions.server";

const filters = {
    price: [
        { value: '0', label: '$0 - $25', checked: false },
        { value: '25', label: '$25 - $50', checked: false },
        { value: '50', label: '$50 - $75', checked: false },
        { value: '75', label: '$75+', checked: false },
    ],
    color: [
        { value: 'white', label: 'White', checked: false },
        { value: 'beige', label: 'Beige', checked: false },
        { value: 'blue', label: 'Blue', checked: true },
        { value: 'brown', label: 'Brown', checked: false },
        { value: 'green', label: 'Green', checked: false },
        { value: 'purple', label: 'Purple', checked: false },
    ],
    size: [
        { value: 'xs', label: 'XS', checked: false },
        { value: 's', label: 'S', checked: true },
        { value: 'm', label: 'M', checked: false },
        { value: 'l', label: 'L', checked: false },
        { value: 'xl', label: 'XL', checked: false },
        { value: '2xl', label: '2XL', checked: false },
    ],
    category: [
        {
            value: 'all-new-arrivals',
            label: 'All New Arrivals',
            checked: false,
        },
        { value: 'tees', label: 'Tees', checked: false },
        { value: 'objects', label: 'Objects', checked: false },
        { value: 'sweatshirts', label: 'Sweatshirts', checked: false },
        { value: 'pants-and-shorts', label: 'Pants & Shorts', checked: false },
    ],
};
const sortOptions = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export const action: ActionFunction = async ({ request, context }) => {
    const { medusa } = context;
    const cartId = await getCartId(request);
    const form = await request.formData();
    const productToAdd = form.get('product-id');
    const quantity = form.get('quantity');

    const { product } = await medusa.products.retrieve(productToAdd);

    console.log('product.variants[0].id', product.variants[0].id);
    console.log('cartId', cartId);
    // add item to cart
    const add = await medusa.carts.lineItems.create(cartId, {
        metadata: undefined,
        quantity: parseInt(quantity),
        variant_id: product.variants[0].id,
    });
    console.log('ADD', add);

    // Create payment session
    // await medusa.carts.createPaymentSessions(cartId);

    const cart = await medusa.carts.retrieve(cartId).then(({ cart }) => cart);

    console.log('cart', cart);


    const itemCount = cart.items.reduce((prev, current) => prev + current.quantity, 0);
    console.log('itemCount', itemCount);

    return {
        productCount: itemCount
    };
}

export const loader: LoaderFunction = async ({ request, context }) => {
    const user = await getUser(request);
    const cartId = await getCartId(request);
    const { medusa } = context;

    if (!user) { return redirect('/sign-in') }
    if (!cartId) {
        // Create cart
        const newCart = await medusa.carts.create().then(({ cart }) => cart);
        const cartId = newCart.id;
        return createCartSession(cartId, '/store');
    }

    const cart = await medusa.carts.retrieve(cartId).then(({ cart }) => cart);
    const { products } = await medusa.products.list();

    const sortedProduct = products.sort(function(a, b){
        if(a.title < b.title) { return -1; }
        if(a.title > b.title) { return 1; }
        return 0;
    });

    // Remove membership
    const pruneMembership = sortedProduct.filter(product => product.id !== 'prod_01FXBT8RNY1RRXRKDXK9CD91JJ');

    let quantity = 0;
    const cartCount = cart.items.reduce((prev, current) => prev + current.quantity, quantity);

    return {
        products: pruneMembership,
        isLoggedIn: user,
        cartCount
    };
};

export default function Store() {
    const { products, isLoggedIn, cartCount } = useLoaderData();
    const data = useActionData();
    // const [quantity, setQuantity] = useState(0);
    console.log('data', data);
    return (
        <div className="bg-white">
            <Navigation isLoggedIn={isLoggedIn} quantity={data ? data.productCount : cartCount} />
            <main className="pb-24">
                <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                        Fusilier Family Farm Produce
                    </h1>
                    <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">
                        Pick your favorite product and order today and have it
                        at your door step tomorrow.
                    </p>
                </div>

                {/* Filters */}
                <Disclosure
                    as="section"
                    aria-labelledby="filter-heading"
                    className="relative z-10 border-t border-b border-gray-200 grid items-center"
                >
                    <h2 id="filter-heading" className="sr-only">
                        Filters
                    </h2>
                    <div className="relative col-start-1 row-start-1 py-4">
                        <div className="max-w-7xl mx-auto flex space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
                            <div>
                                <Disclosure.Button className="group text-gray-700 font-medium flex items-center">
                                    <FilterIcon
                                        className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    2 Filters
                                </Disclosure.Button>
                            </div>
                            <div className="pl-6">
                                <button type="button" className="text-gray-500">
                                    Clear all
                                </button>
                            </div>
                        </div>
                    </div>
                    <Disclosure.Panel className="border-t border-gray-200 py-10">
                        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
                            <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                                <fieldset>
                                    <legend className="block font-medium">
                                        Price
                                    </legend>
                                    <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                                        {filters.price.map(
                                            (option, optionIdx) => (
                                                <div
                                                    key={option.value}
                                                    className="flex items-center text-base sm:text-sm"
                                                >
                                                    <input
                                                        id={`price-${optionIdx}`}
                                                        name="price[]"
                                                        defaultValue={
                                                            option.value
                                                        }
                                                        type="checkbox"
                                                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                                        defaultChecked={
                                                            option.checked
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`price-${optionIdx}`}
                                                        className="ml-3 min-w-0 flex-1 text-gray-600"
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend className="block font-medium">
                                        Color
                                    </legend>
                                    <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                                        {filters.color.map(
                                            (option, optionIdx) => (
                                                <div
                                                    key={option.value}
                                                    className="flex items-center text-base sm:text-sm"
                                                >
                                                    <input
                                                        id={`color-${optionIdx}`}
                                                        name="color[]"
                                                        defaultValue={
                                                            option.value
                                                        }
                                                        type="checkbox"
                                                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                                        defaultChecked={
                                                            option.checked
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`color-${optionIdx}`}
                                                        className="ml-3 min-w-0 flex-1 text-gray-600"
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </fieldset>
                            </div>
                            <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                                <fieldset>
                                    <legend className="block font-medium">
                                        Size
                                    </legend>
                                    <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                                        {filters.size.map(
                                            (option, optionIdx) => (
                                                <div
                                                    key={option.value}
                                                    className="flex items-center text-base sm:text-sm"
                                                >
                                                    <input
                                                        id={`size-${optionIdx}`}
                                                        name="size[]"
                                                        defaultValue={
                                                            option.value
                                                        }
                                                        type="checkbox"
                                                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                                        defaultChecked={
                                                            option.checked
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`size-${optionIdx}`}
                                                        className="ml-3 min-w-0 flex-1 text-gray-600"
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend className="block font-medium">
                                        Category
                                    </legend>
                                    <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                                        {filters.category.map(
                                            (option, optionIdx) => (
                                                <div
                                                    key={option.value}
                                                    className="flex items-center text-base sm:text-sm"
                                                >
                                                    <input
                                                        id={`category-${optionIdx}`}
                                                        name="category[]"
                                                        defaultValue={
                                                            option.value
                                                        }
                                                        type="checkbox"
                                                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                                        defaultChecked={
                                                            option.checked
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`category-${optionIdx}`}
                                                        className="ml-3 min-w-0 flex-1 text-gray-600"
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </Disclosure.Panel>
                    <div className="col-start-1 row-start-1 py-4">
                        <div className="flex justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Menu as="div" className="relative inline-block">
                                <div className="flex">
                                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sort
                                        <ChevronDownIcon
                                            className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {sortOptions.map((option) => (
                                                <Menu.Item key={option.name}>
                                                    {({ active }) => (
                                                        <a
                                                            href={option.href}
                                                            className={classNames(
                                                                option.current
                                                                    ? 'font-medium text-gray-900'
                                                                    : 'text-gray-500',
                                                                active
                                                                    ? 'bg-gray-100'
                                                                    : '',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            {option.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </Disclosure>

                {/* Product grid */}
                <section
                    aria-labelledby="products-heading"
                    className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8"
                >
                    <h2 id="products-heading" className="sr-only">
                        Products
                    </h2>

                    <div className="-mx-px border-l border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative p-4 border-r border-b border-gray-200 sm:p-6"
                            >
                                <h3 className="text-sm font-medium text-gray-900">
                                    {product.title}
                                </h3>
                                <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                                    <img
                                        src={product.imageSrc}
                                        alt={product.imageAlt}
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                                <div className="pt-10 pb-4 text-center">
                                    <div className="mt-3 flex flex-col items-center">
                                        <div className="flex items-center">
                                            <form
                                                action='/store'
                                                method="post"
                                            >
                                                <input type="text" value={product.id} name="product-id" hidden readOnly />
                                                <div className="pb-4">
                                                    <label htmlFor="quantity" className="w-full text-gray-700 text-sm font-semibold">Quantity</label>
                                                    <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                                        {/*<button*/}
                                                        {/*    onClick={() => setQuantity(quantity--)}*/}
                                                        {/*    className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"*/}
                                                        {/*>*/}
                                                        {/*    <span className="m-auto text-2xl font-thin">-</span>*/}
                                                        {/*</button>*/}
                                                        <input type="number" min="1" max="100" name="quantity" className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"/>
                                                        {/*<button*/}
                                                        {/*    onClick={() => setQuantity(quantity++)}*/}
                                                        {/*    className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"*/}
                                                        {/*>*/}
                                                        {/*    <span className="m-auto text-2xl font-thin">+</span>*/}
                                                        {/*</button>*/}
                                                    </div>
                                                </div>
                                                <button
                                                    className="w-full flex items-center justify-center px-4 py-1 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-cyan-700 md:py-2 md:text-lg md:px-6"
                                                    type="submit"
                                                >
                                                    <span className="sr-only">Add {product.title} to cart.</span>
                                                    Add to cart
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-base font-medium text-gray-900">
                                        {formatMoney(product.variants[0]?.prices[0].amount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pagination */}
                <nav
                    aria-label="Pagination"
                    className="max-w-7xl mx-auto px-4 mt-6 flex justify-between text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
                >
                    <div className="min-w-0 flex-1">
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            Previous
                        </a>
                    </div>
                    <div className="hidden space-x-2 sm:flex">
                        {/* Current: "border-indigo-600 ring-1 ring-indigo-600", Default: "border-gray-300" */}
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            1
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            2
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-indigo-600 ring-1 ring-indigo-600 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            3
                        </a>
                        <span className="inline-flex items-center text-gray-500 px-1.5 h-10">
                            ...
                        </span>
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            8
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            9
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            10
                        </a>
                    </div>
                    <div className="min-w-0 flex-1 flex justify-end">
                        <a
                            href="#"
                            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                        >
                            Next
                        </a>
                    </div>
                </nav>
            </main>
            <Footer />
            <FooterSocial />
        </div>
    );
}
