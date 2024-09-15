const queryToArray = (query: any): string[] => {
  if (!query) {
    return [];
  }

  if (Array.isArray(query)) {
    return query.map((item) => String(item));
  }

  if (typeof query == 'string' && query.includes(',')) {
    return query.split(',').map((item) => item.trim());
  }

  if (typeof query == 'object') {
    return Object.values(query).map((item) => String(item));
  }

  return [String(query)];
};

export default queryToArray;
