function formatDate(date: string | Date): string {
    let d = new Date(date);
    let hh: number = d.getHours();
    let m: number | string = d.getMinutes();
    let s: number | string = d.getSeconds();
    let dd: string = "AM";
    let h: number | string = hh;

    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h === 0) {
        h = 12;
    }

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    h = h < 10 ? "0" + h : h;

    // Match the time format as HH:MM:SS
    const timePattern = `${hh < 10 ? '0' : ''}${hh}:${m}:${s}`;
    const replacement: string = `${h}:${m} ${dd}`;

    // Convert the date to a string (for both Date and string inputs) and replace the matched pattern
    return date.toString().replace(timePattern, replacement);
}

  console.log(formatDate("2024-12-18 21:00:00"));

  export default formatDate;