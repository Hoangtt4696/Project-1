/* * các hàm support */

export const validateIsNumber = (value) => {
  const regexCode = /^[0-9\b]+$/;

  if (!value) {
    return false;
  }

  return regexCode.test(value);
};
