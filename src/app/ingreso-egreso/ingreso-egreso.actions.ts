import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../model/ingreso-egreso.model';

export const setItems = createAction('[IngresoEgreso] setItems', props<{ items: IngresoEgreso[] }>());

export const unSetItems = createAction('[IngresoEgreso] Unset Items');