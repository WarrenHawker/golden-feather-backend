import { isURL } from 'validator';

const sanitiseObject = <T extends Record<string, any>>(obj: T): T => {
  const newObj = {} as T;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        if (isURL(value)) {
          newObj[key] = value.trim() as T[typeof key];
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

export default sanitiseObject;
