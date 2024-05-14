import dayjs from 'dayjs'

export function isInFirstRound(): boolean {
    return dayjs('2024-06-19T13:00:00.000Z').isAfter(dayjs())
}
