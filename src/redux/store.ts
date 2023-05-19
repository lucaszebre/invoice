import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import modeReducer from './modeSlice';
import invoiceReducer from './invoiceSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        mode: modeReducer,
        invoice: invoiceReducer,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

