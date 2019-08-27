// @flow

import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize,
    fontFamily: 'Feather',
    color: variables.textColor,
    '.note': {
      color: '#a7a7a7',
      fontSize: variables.noteFontSize,
    },
    '.light': {
      color: variables.inverseTextColor,
    },
    '.center': {
      textAlign: 'center',
    },
    '.black': {
      color: '#000',
    },
  };

  return textTheme;
};
