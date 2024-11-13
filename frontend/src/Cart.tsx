import React, { useContext } from "react";
import { Context } from "./Context";
const Cart: React.FC = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Component must be used within a Provider");
  }

  const { state, setState } = context;

  const addToCart = (item: { name: string }) => {
    setState((prevState) => ({
      ...prevState,
      cart: [...prevState.cart, item],
    }));
  };

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {state.cart.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => addToCart({name: 'New Item'})}>Add New Item</button>
    </div>
  );
};

export default Cart;
