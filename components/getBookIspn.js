

const fetchBookData = async (isbn) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  
  export { fetchBookData };

