fetch("https://gutendex.com/books")
  .then((response) => response.json())
  .then((data) => {
  })
  .catch((error) => {
    console.error(error);
  });
