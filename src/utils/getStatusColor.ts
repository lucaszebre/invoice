export const getStatusColors = (status?: string) => {
    switch (status) {
        case 'pending':
            return {
                color: '#33D69F',
                colorStatus: '#D6FCEC'
            };
        case 'paid':
            return {
                color: '#FF8F00',
                colorStatus: '#FFECD1'
            };
        default:
            return {
                color: '#373B53',
                colorStatus: '#C7C9D9'
            };
    }
};