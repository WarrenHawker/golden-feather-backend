const formatDate = (timestamp: string | number) => {
  const date = new Date(timestamp);

  // Format the date and time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Create a readable format: "YYYY-MM-DD HH:MM:SS"
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default formatDate;