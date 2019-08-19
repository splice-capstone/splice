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
  myReceipts: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser':
      console.log('set user', action.user);
      return {
        ...state,
        currentUser: action.user,
      };
    default:
      return state;
  }
};
