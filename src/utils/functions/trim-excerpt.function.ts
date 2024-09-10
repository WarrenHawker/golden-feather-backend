const trimExcerpt = (str: string) => {
  if (str.length > 75) {
    return str.slice(0, 72) + '...'; // Adds "..." to indicate truncation
  }
  return str;
};

export default trimExcerpt;
