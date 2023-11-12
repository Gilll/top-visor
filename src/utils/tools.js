export function cutIp(ip) {
    let start = 0;

    if (ip.startsWith('http://')) {
        start = 7;
    } else if (ip.startsWith('https://')) {
        start = 8;
    }

    if (Number(ip.slice(ip.lastIndexOf(':') + 1))) {
        return ip.slice(start, ip.lastIndexOf(':'));
    } else {
        return ip.slice(start);
    }

}

export const getDaysArr = (qty) => {
    let dates = [];

    for (let i = 0; i < qty; i++) {
        let _date = new Date(Date.now() - (i * 24 * 3600000)),
            day = _date.getDate().toString().padStart(2, '0'),
            month = (_date.getMonth() + 1).toString().padStart(2, '0'),
            year = _date.getFullYear();

        dates.push({
            endDate: `${year}-${month}-${day}`,
            startDate: `${year}-${month}-${day}`
        })
    }
    return {requestPeriods: dates };
}