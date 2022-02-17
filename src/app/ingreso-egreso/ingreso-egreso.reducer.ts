import { createReducer, on } from '@ngrx/store';
import { setItems, unSetItems } from './ingreso-egreso.actions';
import { IngresoEgreso } from '../model/ingreso-egreso.model';

export interface State {
    items: IngresoEgreso[]; 
}

export const initialState: State = {
    items: [ ],
}

const _ingresoEgresoReducer = createReducer(initialState, 
    on(setItems, (state, { items }) =>    { 
        return   ({ ...state, items: [ ...items ] });}),
     on(unSetItems, (state) => ({ ...state, items: [] })), 
);

export function ingresoEgresoReducer(state: any, action: any) {
    return _ingresoEgresoReducer(state, action);
}