import { createReducer, on } from '@ngrx/store';
import * as authActions from './auth.actions';
import { User } from '../model/user.mode';

export interface State {
    user: User | null;
}

export const initialState: State = {  
    user: null
 }

const _authReducer = createReducer(initialState,

    on(authActions.setUser, (state, { user }) => ({ ...state, user: { ...user }})),
    on(authActions.unSetUser, (state) => ({...state, user: null })),

);

export function authReducer(state: any, action: any) {
    return _authReducer(state, action);
}