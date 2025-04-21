const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const query = event.queryStringParameters.query || "India";
  const apiKey = process.env.NEWS_API_KEY;

  const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Handle API errors gracefully
    if (!data.articles) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "NewsAPI error",
          error: data.message || "No articles returned from NewsAPI",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch news",
        error: error.message,
      }),
    };
  }
};
