import { escape } from 'validator';

const sanitiseArray = (array: string[]): string[] => {
  if (array.length < 1) {
    return [];
  } else {
    return array.map((item) => escape(item).trim());
  }
};

export default sanitiseArray;
