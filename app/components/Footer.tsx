// @ts-nocheck
import footerLogo from '../images/footer_logo_light.png';
import footerBackground from '../images/footer-one-bg 1.png';
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaPinterest,
} from 'react-icons/fa';

const navigation = {
    company: [
        { name: 'Our Farm', href: '#' },
        { name: 'Events', href: '#' },
        { name: 'Photos', href: '#' },
        { name: 'About Us', href: '#' },
        { name: 'Contact Us', href: '#' },
    ],
    legal: [
        { name: 'Sign up', href: '#' },
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
        { name: 'Accessibility Statement', href: '#' },
    ],
    social: [
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/FusilierFarms96/about?tab=overview',
            icon: () => <FaFacebook />,
        },
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/fusilierfamilyfarms96/',
            icon: () => <FaInstagram />,
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com/FusilierFarms96',
            icon: () => <FaTwitter />,
        },
        {
            name: 'Youtube',
            href: 'https://www.youtube.com/channel/UCdwg4v52Z15KlvamzjF0TPA',
            icon: () => <FaYoutube />,
        },
        {
            name: 'Pinterest',
            href: 'https://www.pinterest.com/fusilierfarms/',
            icon: () => <FaPinterest />,
        },
    ],
};

export default function Footer() {
    return (
        <footer
            className="bg-emerald-900 relative"
            aria-labelledby="footer-heading"
        >
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <img src={footerLogo} alt="Company name" />
                        <p className="text-white text-base">
                            We proudly provide fresh produce from our family to
                            yours.
                        </p>
                        <div className="flex space-x-6">
                            {navigation.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-white hover:text-gray-500"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8"></div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                    Company
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {navigation.company.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="text-base text-white hover:text-gray-900"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                    Legal
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {navigation.legal.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="text-base text-white hover:text-gray-900"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <img
                className="absolute bottom-0 mx-auto left-0 right-0 pointer-events-none"
                src={footerBackground}
                alt=""
            />
        </footer>
    );
}
