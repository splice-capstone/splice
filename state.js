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
  currentReceipt: {
    items: [],
    receipt_users: [],
    date: '',
    owner: '',
    paid: false,
    restaurant: '',
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  mode: 'view',
  myReceipts: [],
  myContacts: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.user,
        myReceipts: action.receipts,
      };
    case 'SET_CONTACTS':
      return {
        ...state,
        myContacts: action.contacts,
      };
    default:
      return state;
  }
};
