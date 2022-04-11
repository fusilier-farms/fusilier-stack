import HomePageHero from '~/components/HomePageHero';
import Navigation from '~/components/Navigation';
import Footer from '~/components/Footer';
import { useLoaderData, Link } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/node';
import {getUser} from "~/utils/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    return {
        user,
    };
};

export default function Index() {
    const { user } = useLoaderData();

    return (
        <>
            <Navigation user={user} />
            <HomePageHero />
            <div className="relative bg-fusilier-tan">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-cols-2 xl:grid-flow-col-dense xl:gap-x-8">
                    <div className="relative pt-12 pb-64 sm:pt-24 sm:pb-64 xl:col-start-1 xl:pb-24">
                        <h2 className="text-sm font-semibold tracking-wide uppercase">
                            <span className="bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">
                                Fresh Produce
                            </span>
                        </h2>
                        <p className="mt-3 text-3xl font-extrabold text-stone-900">
                            We proudly provide fresh produce from our family to
                            yours.
                        </p>
                        <p className="mt-5 text-lg text-stone-700">
                            We are proud to be fifth and sixth generation
                            Fusilier's farming this great land. We, Mike and
                            Kathy, manage the home farm with the help of our
                            four children and their spouses. The home farm is
                            220 acres at the edge of the Irish Hills in
                            Manchester, Michigan.
                        </p>
                        <p className="mt-5 text-lg text-stone-700">
                            Most of our farm is devoted and planted with our
                            highest quality of produce that we proudly offer to
                            you. Also, we have a large selection of flowers
                            available for you to choose from! We have several
                            ways that we provide you with produce and flowers.
                            We attend several markets, have two stores open
                            daily, and offer a CSA (Community Supported
                            Agriculture) program to you.
                        </p>
                        <p className="mt-5 text-lg text-stone-700">
                            We are very excited about the recent opportunities
                            in providing fresh produce to a growing number of
                            people. We attend several markets a week and we hope
                            to see you at one of them! Besides our stores in
                            Chelsea and Manchester, we go to farmers markets
                            four days a week.
                        </p>
                        <ul className="text-stone-700 list-disc py-8">
                            <li className="px-6 py-2 w-full">
                                On Sundays, we attend the Birmingham Farmers
                                Market.
                            </li>
                            <li className="px-6 py-2 w-full">
                                On Tuesdays, we attend Detroit Eastern Market.
                            </li>
                            <li className="px-6 py-2 w-full">
                                On Thursdays, we attend Northville Farmers
                                Market.
                            </li>
                            <li className="px-6 py-2 w-full">
                                Finally, on Saturdays we attend Detroit Eastern
                                Market.
                            </li>
                        </ul>
                        <p className="mt-5 text-lg text-stone-700">
                            You could say we are busy, but there is nothing that
                            would make us happier than to serve you the best
                            produce. We are proud to be farmers and we hope to
                            let you get to know us and our farm better. To see
                            the whole list of markets we attend go to our
                            Farmers Market tab for more information!
                        </p>
                    </div>
                    <div className="relative pt-12 pb-64 sm:pt-24 sm:pb-64 xl:col-start-2 xl:pb-24 flex items-center justify-center">
                        <img
                            className="rounded shadow"
                            src="https://s3.amazonaws.com/sfc-dynamic-content/gallery/1044/w500/139969560623.28.52.14.jpg"
                            alt=""
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white">
                <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="block">Ready to get started?</span>
                        <span className="block bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                            Get in touch or create an account.
                        </span>
                    </h2>
                    <div className="mt-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-5">
                        <Link
                            to="/about-us"
                            className="flex items-center justify-center bg-gradient-to-r from-emerald-600 to-cyan-600 bg-origin-border px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white hover:from-emerald-700 hover:to-cyan-700"
                        >
                            Learn more
                        </Link>
                        <Link
                            to="/produce-home-delivery"
                            className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-emerald-800 bg-cyan-50 hover:bg-emerald-100"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
