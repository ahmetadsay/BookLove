// api/books.js

export async function fetchBooksFromGoogleAPI(searchQuery, selectedCategory) {
    try {
      const apiKey = 'AIzaSyDwQry89DuMeugtvVOdisaFaNODJdEMqT4'; // Replace with your API key
      const maxResults = 10; // Maximum number of results per request
  
      // Construct the URL for the Google Books API
      const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&subject=${selectedCategory}&maxResults=${maxResults}&key=${apiKey}`;
  
      const response = await fetch(url);
      const data = await response.json();

        console.log(data);
  
      if (data.items) {
        return data.items; // Array of books
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }
  