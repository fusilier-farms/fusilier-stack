import Medusa from '@medusajs/medusa-js';

const BACKEND_URL = 'http://localhost:9000';

export const createClient = () => new Medusa({ maxRetries: 3, baseUrl: BACKEND_URL });
