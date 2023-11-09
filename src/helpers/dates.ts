import moment from 'moment'

export const FormatDate = (date: moment.MomentInput, format = "MMM D, YYYY") => {
    if (date) {
        return moment(date).format(format);
    }

    return "";
};

export const getAsZeroedOutUtcDate = (date: Date) => {
    const newDate = new Date(date.getTime());
    newDate.setUTCFullYear(newDate.getFullYear());
    newDate.setUTCMonth(newDate.getMonth());
    newDate.setUTCDate(newDate.getDate());
    newDate.setUTCHours(0, 0, 0, 0);

    return newDate;
};