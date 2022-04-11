import Medusa from '@medusajs/medusa-js';

const BACKEND_URL = 'http://localhost:9000';

export const createClient = () => new Medusa({ baseUrl: BACKEND_URL });
