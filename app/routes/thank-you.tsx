// @ts-nocheck
import Navigation from '~/components/Navigation';
import Footer from '~/components/Footer';
import FooterSocial from "~/components/FooterSocial";
import { useLoaderData, Link} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { getUser, getOrderId } from "~/utils/sessions.server";
import {formatMoney} from "~/utils";

export const loader: LoaderFunction = async ({ request, context }) => {
    const { medusa } = context;
    const user = await getUser(request);
    const orderId = await getOrderId(request);
    const order = await medusa.orders.retrieve(orderId).then(({ order }) => order);

    return {
        orders: [order],
        isLoggedIn: user,
    }
}

export default function Thanks() {
    const { isLoggedIn, orders } = useLoaderData();
    return (
        <div className="bg-white">
            <Navigation isLoggedIn={isLoggedIn}/>
            <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:pb-24 lg:px-8">
                <div className="max-w-xl">
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">We got your order!</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Your order has been placed and will be on its way for your delivery day.
                    </p>
                </div>

                <section aria-labelledby="recent-heading" className="mt-16">
                    <h2 id="recent-heading" className="sr-only">
                        We got your order!
                    </h2>

                    <div className="space-y-20">
                        {orders.map((order) => (
                            <div key={order.id}>
                                <h3 className="sr-only">
                                    Order placed on <time dateTime={order.created_at}>{order.date}</time>
                                </h3>

                                <div className="bg-gray-50 rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8">
                                    <dl className="divide-y divide-gray-200 space-y-6 text-sm text-gray-600 flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
                                        <div className="flex justify-between sm:block">
                                            <dt className="font-medium text-gray-900">Date placed</dt>
                                            <dd className="sm:mt-1">
                                                <time dateTime={order.created_at}>{order.date}</time>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between pt-6 sm:block sm:pt-0">
                                            <dt className="font-medium text-gray-900">Order number</dt>
                                            <dd className="sm:mt-1">{order.display_id}</dd>
                                        </div>
                                        <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                                            <dt>Total amount</dt>
                                            <dd className="sm:mt-1">{formatMoney(order.total)}</dd>
                                        </div>
                                    </dl>
                                    <Link
                                        to="/store"
                                        className="w-full flex items-center justify-center bg-white mt-6 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:mt-0"
                                    >
                                        Continue Shopping
                                        <span className="sr-only">for order {order.number}</span>
                                    </Link>
                                </div>

                                <table className="mt-4 w-full text-gray-500 sm:mt-6">
                                    <caption className="sr-only">Products</caption>
                                    <thead className="sr-only text-sm text-gray-500 text-left sm:not-sr-only">
                                    <tr>
                                        <th scope="col" className="sm:w-2/5 lg:w-1/3 pr-8 py-3 font-normal">
                                            Product
                                        </th>
                                        <th scope="col" className="hidden w-1/5 pr-8 py-3 font-normal sm:table-cell">
                                            Unit Price
                                        </th>
                                        <th scope="col" className="hidden pr-8 py-3 font-normal sm:table-cell">
                                            Quantity
                                        </th>
                                        <th scope="col" className="w-0 py-3 font-normal text-right">
                                            Info
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="border-b border-gray-200 divide-y divide-gray-200 text-sm sm:border-t">
                                    {order.items.map((product) => (
                                        <tr key={product.id}>
                                            <td className="py-6 pr-8">
                                                <div className="flex items-center">
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                        className="w-16 h-16 object-center object-cover rounded mr-6"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{product.title}</div>
                                                        <div className="mt-1 sm:hidden">{formatMoney(product.unit_price)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden py-6 pr-8 sm:table-cell">{formatMoney(product.unit_price)}</td>
                                            <td className="hidden py-6 pr-8 sm:table-cell">{product.quantity}</td>
                                            <td className="py-6 font-medium text-right whitespace-nowrap">
                                                <Link to={`/store/${product.id}`} className="text-indigo-600">
                                                    View<span className="hidden lg:inline"> Product</span>
                                                    <span className="sr-only">, {product.title}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
            <FooterSocial />
        </div>
    );
}
