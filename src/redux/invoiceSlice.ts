import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice, FilterType } from '@/types/InvoiceType';

type InvoiceState = {
    view: boolean;
    edit: boolean;
    isNew: boolean;
    isDelete: boolean;
    filter: FilterType;
};

const initialState: InvoiceState = {
    view: true,
    edit: false,
    isNew: false,
    isDelete: false,
    filter: {} as FilterType,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<boolean>) => {
        state.view = action.payload;
        },
        setEdit: (state, action: PayloadAction<boolean>) => {
        state.edit = action.payload;
        },
        setIsNew: (state, action: PayloadAction<boolean>) => {
        state.isNew = action.payload;
        },
        setIsDelete: (state, action: PayloadAction<boolean>) => {
        state.isDelete = action.payload;
        },
        setFilter: (state, action: PayloadAction<FilterType>) => {
        state.filter = action.payload;
        },
    },
});

export const {  setView, setEdit, setIsNew, setIsDelete, setFilter } = invoiceSlice.actions;

export default invoiceSlice.reducer;
