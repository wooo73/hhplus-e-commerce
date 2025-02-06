import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getCurrentDate = () => {
    const currentDate = dayjs().tz('Asia/Seoul').startOf('day').format('YYYY-MM-DD');
    return currentDate;
};

export const getPastDate = (day: number) => {
    const currentDate = getCurrentDate();
    const pastDate = dayjs(currentDate).subtract(day, 'day').startOf('day').format('YYYY-MM-DD');
    return pastDate;
};

export const getUpcomingDate = (day: number) => {
    const currentDate = getCurrentDate();
    const futureDate = dayjs(currentDate).add(day, 'day').startOf('day').format('YYYY-MM-DD');
    return futureDate;
};
