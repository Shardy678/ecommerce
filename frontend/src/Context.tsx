import React, { createContext, useState, ReactNode, useEffect } from "react";

interface State {
  cart: Array<{ name: string }>;
  user: string | null;
}

interface MyContextType {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const Context = createContext<MyContextType | undefined>(undefined);

const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<State>(() => {
    const savedCart = localStorage.getItem("cart");
    return {
      cart: savedCart ? JSON.parse(savedCart) : [],
      user: null,
    };
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
