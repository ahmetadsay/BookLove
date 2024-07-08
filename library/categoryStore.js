export async function fetchCategoriesFromGoogleAPI(selectedCategory) {
    try {
      const apiKey = "AIzaSyDwQry89DuMeugtvVOdisaFaNODJdEMqT4";
       // Replace with your API key
      const maxResults = 10; // Maximum number of results per request
      const url =`https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&orderBy=relevance&maxResults=${maxResults}&key=${apiKey}`

  
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data.items);


  
  
  
      if (data.items) {
        // Loop through each item and log the image links
        data.items.forEach(item => {
          if (item.volumeInfo && item.volumeInfo.imageLinks) {
              console.log("Title:", item.volumeInfo.title);
              // Check if the thumbnail URL starts with 'http:' and replace it with 'https:'
              const secureThumbnailUrl = item.volumeInfo.imageLinks.thumbnail.replace(/^http:/, 'https:');
              console.log("Thumbnail:", secureThumbnailUrl);
          }
      });
        return data.items;
      }

    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  } 
  const maxResults = 10; // Maximum number of results per request
  
      // Construct the URL for the Google Books API
      