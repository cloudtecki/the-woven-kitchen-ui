import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from './rootReducer';

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;