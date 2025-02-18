export const convertUtcToIst=(utcDateString:string) =>{

    return new Date(utcDateString).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}