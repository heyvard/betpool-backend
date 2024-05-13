import { allowCors } from '../../cors/corsHelper';
import { auth } from '../../auth/authHandler';
const handler = async function handler(opts) {
    const { user, res, client } = opts;
    if (!user) {
        res.status(401);
        return;
    }
    const charity = (await client.query('SELECT charity from users where active is true')).rows;
    res.json(charity);
};
export default allowCors(auth(handler));
