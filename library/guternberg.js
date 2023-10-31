fetch("https://gutendex.com/books")
  .then((response) => response.json())
  .then((data) => {
    console.log('guternberg results' ,data.results);
  })
  .catch((error) => {
    console.error(error);
  });
