import { allowCors } from '../../../../cors/corsHelper'
import { auth } from '../../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, req } = opts
    const { id } = req.query

    res.status(200).json({ req: req.body, id })
}
export default allowCors(auth(handler))
