

export function isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
    }

export function Paymentdue(date1:string,days:string){
    // Convert the date1 string into a Date object
    let dueDate = new Date(date1);
    // Add the number of days to the Date object
    dueDate.setDate(dueDate.getDate() + parseInt(days, 10));
    if (dueDate && isValidDate(dueDate)) {
        // Format the date into "YYYY-MM-DD" format
        let formattedDate = dueDate.toISOString().slice(0, 10);
        return formattedDate;
        } else {
        return;
        }
    
}