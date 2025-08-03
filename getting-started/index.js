const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  if (req.url === "/getting-started") {
    res.end("Welcome to the Getting Started page!\n");
    return;
  }
  res.end("Hello, World!\n");
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000/");
});
