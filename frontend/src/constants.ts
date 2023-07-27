let serverURI;

if (import.meta.env.MODE === "development") {
  serverURI = "http://localhost:5000";
} else {
  serverURI = "http://localhost:5000";
}

export default {
  serverURI,
};
