import React from 'react';
import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import {
  store,
  fetchCart,
  itemAdded,
  quantityChanged,
  cartSelectors,
  type AppDispatch,
  type RootState,
} from '@mfe/shared-store';
import { queryClient, productsQuery } from '@mfe/shared-query';

export function CartPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => cartSelectors.selectAll(state.cart));
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const { data: products, isLoading } = useQuery(productsQuery);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="remote-react-widget" style={{ border: '1px solid #999', padding: '1rem', borderRadius: 6 }}>
      <h3>Cart (React remote)</h3>
      <p>
        Products via TanStack Query, cart via the shared Redux store — both singletons imported from{' '}
        <code>@mfe/shared-query</code> / <code>@mfe/shared-store</code>.
      </p>
      {isLoading && <p>Loading products…</p>}
      <ul>
        {products?.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price}{' '}
            <button
              type="button"
              onClick={() =>
                dispatch(itemAdded({ id: product.id, name: product.name, price: product.price, qty: 1 }))
              }
            >
              Add to cart
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.qty} = ${item.price * item.qty}{' '}
            <button type="button" onClick={() => dispatch(quantityChanged({ id: item.id, qty: item.qty + 1 }))}>
              +
            </button>
            <button type="button" onClick={() => dispatch(quantityChanged({ id: item.id, qty: item.qty - 1 }))}>
              -
            </button>
          </li>
        ))}
      </ul>
      <strong>Total: ${total}</strong>
    </div>
  );
}

export default function Widget() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CartPanel />
      </QueryClientProvider>
    </Provider>
  );
}
