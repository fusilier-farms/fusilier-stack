import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaPinterest,
} from 'react-icons/fa';

const navigation = [
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
];

export default function FooterSocial() {
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-slate-800 hover:text-gray-500"
                        >
                            <span className="sr-only">{item.name}</span>
                            <item.icon className="h-6 w-6" aria-hidden="true" />
                        </a>
                    ))}
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                    <p className="text-center text-base text-slate-800">
                        &copy; {new Date().getFullYear()} Fusilier Family Farms,
                        Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
