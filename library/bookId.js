export async function fetchBooksIdFromGoogleAPI(id) {
    try {
      const apiKey = 'AIzaSyDwQry89DuMeugtvVOdisaFaNODJdEMqT4'; // Replace with your API key
      const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`;
  
      const response = await fetch(url);
      const data = await response.json();
  
  
  
      if (data) {
        return data; // Book details for the specified ID
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null; // Return null for error handling
    }
  }
  