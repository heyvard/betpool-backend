import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandler'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, knex } = opts

    const charity = (
        await knex.raw(
            `
          SELECT u.charity
          FROM users u;`,
        )
    ).rows

    res.json(charity)
}
export default allowCors(auth(handler))
