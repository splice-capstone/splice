import React, {
  useState,
  useEffect,
  createContext,
  useReducer,
  useContext,
} from 'react';

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);

export const initialState = {
  currentUser: {},
  currentReceipt: {},
  currentPage: 'home',
  mode: 'view',
  myReceipts: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.user,
        myReceipts: action.receipts,
      };
    default:
      return state;
  }
};
