import validator from 'validator';
const { escape } = validator;

export const sanitiseArray = (array: string[]): string[] => {
  if (array.length < 1) {
    return [];
  } else {
    return array.map((item) => escape(item).trim());
  }
};
