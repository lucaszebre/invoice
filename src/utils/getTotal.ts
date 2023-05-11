export function getTotalSum(items: { name: string, qty: string, price: string, total: string }[]) {
    let total = 0;
    items.forEach(item => {
        total += Number(item.price) * Number(item.qty);
    });

    // Return as string
    return total.toFixed(2); // It will round the number to 2 decimal places
}
