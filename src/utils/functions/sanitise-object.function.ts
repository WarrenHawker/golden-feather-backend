import validator from 'validator';
const { isURL } = validator;

export const sanitiseObject = <T extends Record<string, any>>(obj: T): T => {
  const newObj = {} as T;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        if (isURL(newObj[key])) {
          newObj[key] = value.trim();
        } else {
          newObj[key] = '' as T[typeof key];
        }
      } else {
        newObj[key] = value;
      }
    }
  }

  return newObj;
};
