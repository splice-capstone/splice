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

//set error on context if func returns error then render error page
export const initialState = {
  currentUser: {},
  currentReceipt: {},
  mode: 'view',
  myReceipts: [],
  myContacts: [],
  error: '',
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
    case 'SET_RECEIPT':
      return {
        ...state,
        currentReceipt: action.receipt,
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      };

    default:
      return state;
  }
};
