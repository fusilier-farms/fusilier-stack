import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'remix';
import tailwind from './styles/tailwind.css';
import type { MetaFunction, LinksFunction } from 'remix';

export const meta: MetaFunction = () => {
    return { title: 'New Remix App' };
};

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: tailwind }];
};

export default function App() {
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            className="h-full bg-gray-50"
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                {process.env.NODE_ENV === 'development' && <LiveReload />}
            </body>
        </html>
    );
}
