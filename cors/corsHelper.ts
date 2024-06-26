import { VercelRequest, VercelResponse } from '@vercel/node'

export function allowCors(fn: { (req: VercelRequest, res: VercelResponse): Promise<void> }) {
    return async (req: VercelRequest, res: VercelResponse) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        if (req.headers.origin) {
            if (
                ['https://betpool-2022.vercel.app', 'https://em.turix.no', 'http://localhost:3000'].includes(
                    req.headers.origin,
                )
            ) {
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
                res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
                res.setHeader('Access-Control-Allow-Headers', 'Authorization')
                res.setHeader('Access-Control-Max-Age', '600')
            }
        }

        if (req.method === 'OPTIONS') {
            res.status(200).end()
            return
        }
        return await fn(req, res)
    }
}
