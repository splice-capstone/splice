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
  receiptItems: [],
  error: '',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.user,
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
    case 'SET_ITEMS':
      return {
        ...state,
        receiptItems: action.items,
      };
    // case 'REMOVE_ITEM':
    //   return {
    //     ...state,
    //     receiptItems: state.receiptItems.filter(
    //       item => item.id !== action.itemId
    //     ),
    //   };

    default:
      return state;
  }
};
