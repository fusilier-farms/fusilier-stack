import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import {logout} from "~/utils/sessions.server";

export const action: ActionFunction = async ({ request }) => {
    console.log('ACTION')
    return logout(request);
};

export const loader: LoaderFunction = async ({ request }) => {
    console.log('LOADER');
    return logout(request);
};
