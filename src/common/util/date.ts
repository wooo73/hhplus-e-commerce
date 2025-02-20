import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertDayjs = (date: Date | string) => {
    return dayjs(date).tz('Asia/Seoul');
};

export const getCurrentDate = (format: string = 'YYYY-MM-DD') => {
    const currentDate = dayjs().tz('Asia/Seoul').startOf('day').format(format);
    return currentDate;
};

export const getPastDate = (day: number, format: string = 'YYYY-MM-DD') => {
    const currentDate = getCurrentDate();
    const pastDate = dayjs(currentDate).subtract(day, 'day').format(format);
    return pastDate;
};

export const getPastMinuteDate = (minute: number): dayjs.Dayjs => {
    const pastDate = dayjs().tz('Asia/Seoul').subtract(minute, 'minutes');
    return pastDate;
};

export const getUpcomingDate = (day: number, format: string = 'YYYY-MM-DD') => {
    const currentDate = getCurrentDate();
    const futureDate = dayjs(currentDate).add(day, 'day').startOf('day').format(format);
    return futureDate;
};

export const getCustomAddDateTime = (
    day: number,
    hour: number = 0,
    minute: number = 0,
    format: string = 'YYYY-MM-DD HH:mm:ss',
) => {
    const currentDate = getCurrentDate();
    return dayjs(currentDate)
        .add(day, 'day')
        .startOf('day')
        .set('hour', hour)
        .set('minute', minute)
        .format(format);
};
