export async function fetchCategoriesFromGoogleAPI(selectedCategory) {
    try {
      const apiKey = "AIzaSyDwQry89DuMeugtvVOdisaFaNODJdEMqT4";
       // Replace with your API key
      const maxResults = 10; // Maximum number of results per request
      const url =`https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&orderBy=relevance&maxResults=${maxResults}&key=${apiKey}`

  
      const response = await fetch(url);
      const data = await response.json();


  
  
  
      if (data.items) {
        return data.items; // Array of books
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  } 
  const maxResults = 10; // Maximum number of results per request
  
      // Construct the URL for the Google Books API
      