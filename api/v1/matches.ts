import { allowCors } from '../../cors/corsHelper'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'
import { auth } from '../../auth/authHandler'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, user, client } = opts
    if (!user) {
        res.status(401)
        return
    }

    const matches = (
        await client.query(
            `
          SELECT *
          FROM  matches m;`,
        )
    ).rows
    res.status(200).json(matches)
}

export default allowCors(auth(handler))
