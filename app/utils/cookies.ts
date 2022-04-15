import { createCookie } from "@remix-run/node";

export const lastOrder = createCookie("last-order", {
    maxAge: 604_800, // one week
});

export const medusaAuth = createCookie('medusa-auth', {
    maxAge: 604_800,
});
