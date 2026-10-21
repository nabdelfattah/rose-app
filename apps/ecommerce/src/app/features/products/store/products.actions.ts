import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProductRes } from '../model/product';

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': emptyProps(),

    'Load Products Success': props<{
      response: ProductRes;
    }>(),

    'Load Products Failure': props<{
      error: string;
    }>(),
  },
});
