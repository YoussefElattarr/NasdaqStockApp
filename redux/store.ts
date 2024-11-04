// Redux Store
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import stocksReducer from './stocksSlice';

const rootReducer = combineReducers({
  stocks: stocksReducer,
});

export const setupStore : any = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
// export type AppDispatch = typeof setupStore .dispatch;
export type AppDispatch = AppStore['dispatch']

export default setupStore ;
