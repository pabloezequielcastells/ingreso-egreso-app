import { createAction, props } from '@ngrx/store';
import { User } from '../model/user.mode';

export const setUser = createAction(
    '[Auth] setUser',
    props<{ user: User }>()
);

export const unSetUser = createAction(
    '[Auth] unSetUser'
);