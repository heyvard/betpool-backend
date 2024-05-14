import dayjs from 'dayjs'

export function isInFirstRound(): boolean {
    return dayjs('2022-11-25T10:00:00.000Z').isAfter(dayjs())
}
