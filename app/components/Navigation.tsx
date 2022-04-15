import { Fragment, useState } from 'react';
import { Link } from '@remix-run/react';
import truckLogo from '~/images/logo_truck.png';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import {
    MenuIcon,
    SearchIcon,
    ShoppingCartIcon,
    XIcon,
} from '@heroicons/react/outline';

const navigation = {
    categories: [],
    pages: [
        { name: 'Our Farm', href: '/our-farm' },
        { name: 'Events', href: '#' },
        { name: 'Photos', href: '#' },
        { name: 'About Us', href: '#' },
        { name: 'Contact us', href: '#' },
    ],
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navigation({ user, quantity }) {
    const [open, setOpen] = useState(false);
    console.log('USER', user);

    return (
        <div className="bg-white">
            {/* Mobile menu */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 flex z-40 lg:hidden"
                    onClose={setOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-center pt-4 pb-2 px-4">
                                <button
                                    type="button"
                                    className="rounded-md inline-flex items-center justify-center text-gray-400"
                                    onClick={() => setOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>

                                <Link to="/">
                                    <span className="sr-only">Home</span>
                                    <img
                                        className="h-8 w-auto"
                                        src={truckLogo}
                                        alt="Fusilier Family Farm"
                                    />
                                </Link>
                            </div>

                            <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                                {navigation.pages.map((page) => (
                                    <div key={page.name} className="flow-root">
                                        <Link
                                            to={page.href}
                                            className="-m-2 p-2 block font-medium text-gray-900"
                                        >
                                            {page.name}
                                        </Link>
                                    </div>
                                ))}
                                {user ? (
                                    <Link
                                        to="/store"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                    >
                                        Store
                                    </Link>
                                ) : (
                                    <Link
                                        to="/produce-home-delivery"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                    >
                                        Delivery
                                    </Link>
                                )}
                            </div>

                            {user ? (
                                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                                    <div className="flow-root">
                                        <Link
                                            to="#"
                                            className="-m-2 p-2 block font-medium text-gray-900"
                                        >
                                            Account
                                        </Link>
                                    </div>
                                    <div className="flow-root">
                                        <Link
                                            to="#"
                                            className="-m-2 p-2 block font-medium text-gray-900"
                                        >
                                            Sign Outz
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                                    <div className="flow-root">
                                        <Link
                                            to="/register"
                                            className="-m-2 p-2 block font-medium text-gray-900"
                                        >
                                            Create an account
                                        </Link>
                                    </div>
                                    <div className="flow-root">
                                        <form action="/sign-out">
                                            <button className="-m-2 p-2 block font-medium text-gray-900">
                                                Sign outs
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>

            <header className="relative">
                <nav aria-label="Top">
                    <div className="bg-emerald-900">
                        <div className="max-w-7xl mx-auto h-10 px-4 flex items-center justify-between sm:px-6 lg:px-8">
                            <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
                                Get free delivery on orders over $100
                            </p>

                            {user ? (
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    <Link
                                        to="/account"
                                        className="text-sm font-medium text-white hover:text-gray-100"
                                    >
                                        Account
                                    </Link>
                                    <span
                                        className="h-6 w-px bg-gray-600"
                                        aria-hidden="true"
                                    />
                                    <form action="/sign-out">
                                        <button className="text-sm font-medium text-white hover:text-gray-100">
                                            Sign Out
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    <Link
                                        to="/register"
                                        className="text-sm font-medium text-white hover:text-gray-100"
                                    >
                                        Create an account
                                    </Link>
                                    <span
                                        className="h-6 w-px bg-gray-600"
                                        aria-hidden="true"
                                    />
                                    <Link
                                        to="/sign-in"
                                        className="text-sm font-medium text-white hover:text-gray-100"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="border-b border-gray-200">
                                <div className="h-16 flex items-center justify-between">
                                    <div className="hidden lg:flex lg:items-center">
                                        <Link to="/">
                                            <span className="sr-only">
                                                Home
                                            </span>
                                            <img
                                                className="h-8 w-auto"
                                                src={truckLogo}
                                                alt="Fusilier Family Farm"
                                            />
                                        </Link>
                                    </div>

                                    <div className="hidden h-full lg:flex">
                                        <Popover.Group className="ml-8">
                                            <div className="h-full flex justify-center space-x-8">
                                                {navigation.pages.map(
                                                    (page) => {
                                                        return (
                                                            <Link
                                                                key={page.name}
                                                                to={page.href}
                                                                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                                            >
                                                                {page.name}
                                                            </Link>
                                                        );
                                                    }
                                                )}
                                                {user ? (
                                                    <Link
                                                        to="/store"
                                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                                    >
                                                        Store
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to="/produce-home-delivery"
                                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                                    >
                                                        Delivery
                                                    </Link>
                                                )}
                                            </div>
                                        </Popover.Group>
                                    </div>

                                    <div className="flex-1 flex items-center lg:hidden">
                                        <button
                                            type="button"
                                            className="-ml-2 bg-white p-2 rounded-md text-gray-400"
                                            onClick={() => setOpen(true)}
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            <MenuIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>

                                        {/* Search */}
                                        <a
                                            href="#"
                                            className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <span className="sr-only">
                                                Search
                                            </span>
                                            <SearchIcon
                                                className="w-6 h-6"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </div>

                                    <Link to="/" className="lg:hidden">
                                        <span className="sr-only">
                                            Fusilier Family Farms
                                        </span>
                                        <img
                                            src={truckLogo}
                                            alt=""
                                            className="h-8 w-auto"
                                        />
                                    </Link>

                                    <div className="flex-1 flex items-center justify-end">
                                        <div className="flex items-center lg:ml-8">
                                            <div className="flex space-x-8">

                                            </div>

                                            <div className="flow-root">
                                                {user && (
                                                    <Link
                                                        to="/cart"
                                                        className="group -m-2 p-2 flex items-center"
                                                    >
                                                        <ShoppingCartIcon
                                                            className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                                        {quantity}
                                                    </span>
                                                        <span className="sr-only">
                                                        items in cart, view bag
                                                    </span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
