function formatDateTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const days = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    return `time:${hours}:${minute} ${days}/${month}`;
}
console.log(formatDateTime(new Date()))