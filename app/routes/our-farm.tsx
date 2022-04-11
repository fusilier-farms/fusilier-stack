import Navigation from '~/components/Navigation';
import Footer from '~/components/Footer';
import FooterSocial from '~/components/FooterSocial';

export default function OurFarm() {
    return (
        <>
            <Navigation isLoggedIn={false} />
            <div className="py-16 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
                    <div className="text-base max-w-prose mx-auto lg:max-w-none">
                        <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">
                            About Us
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            What makes us different
                        </p>
                    </div>
                    <div className="relative z-10 text-base max-w-prose mx-auto lg:max-w-5xl lg:mx-0 lg:pr-72">
                        <p className="text-lg text-gray-500">
                            We are proud to be fifth and sixth generation
                            Fusilier's farming this great land. We, Mike and
                            Kathy, manage the home farm with the help of our
                            four children and their spouses. The home farm is
                            220 acres at the edge of the Irish Hills in
                            Manchester, Michigan.
                        </p>
                        <p className="text-lg text-gray-500">
                            Most of our farm is devoted and planted with our
                            highest quality of produce that we proudly offer to
                            you. Also, we have a large selection of flowers
                            available for you to choose from! We have several
                            ways that we provide you with produce and flowers.
                            We attend several markets, have two stores open
                            daily, and offer a CSA (Community Supported
                            Agriculture) program to you.
                        </p>
                        <p className="text-lg text-gray-500">
                            We are very excited about the recent opportunities
                            in providing fresh produce to a growing number of
                            people. We attend several markets a week and we hope
                            to see you at one of them!
                        </p>
                        <p className="text-lg text-gray-500">
                            You could say we are busy, but there is nothing that
                            would make us happier than to serve you the best
                            produce. We are proud to be farmers and we hope to
                            let you get to know us and our farm better. To see
                            the whole list of markets we attend go to our
                            Farmers Market tab for more information!
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
            <FooterSocial />
        </>
    );
}
