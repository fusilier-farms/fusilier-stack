import {
    createCookieSessionStorage,
    redirect,
} from "@remix-run/node";
import {lastOrder, medusaAuth} from '~/utils/cookies';

type LoginForm = {
    email: string;
    password: string;
};

// export async function register({
//    username,
//    password,
// }: LoginForm) {
//     const user = await db.user.create({
//         data: { username, password },
//     });
//     return { id: user.id, username };
// }

export async function login(medusa, {
    email,
    password,
}: LoginForm) {
    const user = await medusa.auth.authenticate({ email, password}).then(({customer, response}) => ({
        customer,
        cookie: response.headers['set-cookie']
    }))
    .catch((err) => err);
    if (!user) return null;
    return user;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
    cookie: {
        name: "RJ_session",
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

const cart = createCookieSessionStorage({
    cookie: {
        name: "CART_session",
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

function getCartSession(request: Request) {
    return cart.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    return userId;
}

export async function setCartId(request: Request, cartId: string) {
    const session = await getUserSession(request);
    session.set('cartId', cartId);
    return cartId;
}

export async function getCartId(request: Request) {
    const session = await getCartSession(request);
    const cartId = session.get('cartId');
    console.log('CART ID FUNCTION!', cartId);
    if (!cartId || typeof cartId !== "string") return null;
    return cartId;
}

export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
        const searchParams = new URLSearchParams([
            ["redirectTo", redirectTo],
        ]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (typeof userId !== "string") {
        return null;
    }
    return userId;
}

export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect("/", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}

export async function destroyCartSession(redirectTo: string, orderId: string) {
    const session = await cart.getSession();
    const headers = new Headers();

    headers.append("Set-Cookie", await cart.destroySession(session));
    headers.append("Set-Cookie", await lastOrder.serialize({ orderId }));

    return redirect(redirectTo, {
        headers
    })
}

export async function getOrderId(request) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await lastOrder.parse(cookieHeader);
    return cookie.orderId;
}

export async function createCartSession(
    cartId: string,
    redirectTo: string
) {
    const session = await cart.getSession();
    session.set('cartId', cartId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await cart.commitSession(session),
        }
    })
}

export async function createUserSession(
    userId: string,
    redirectTo: string,
    cookie: string
) {
    const session = await storage.getSession();
    const headers = new Headers();
    session.set("userId", userId);

    headers.append("Set-Cookie", await medusaAuth.serialize({ medusa: cookie }))
    headers.append("Set-Cookie", cookie);
    headers.append("Set-Cookie", await storage.commitSession(session));
    return redirect(redirectTo, {
        headers,
    });
}

export async function getUsersOrders(request) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await medusaAuth.parse(cookieHeader);

    const {orders} = await fetch('http://localhost:9000/store/customers/me/orders', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cookie: cookie.medusa[0],
        }
    }).then(res => res.json());
    return orders;
}
