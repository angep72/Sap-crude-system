const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enhanced CORS configuration
app.use(cors());

const odataServiceUrl =
	
	"https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/";

app.use(
	"/odata",
	createProxyMiddleware({
		target: odataServiceUrl,
		changeOrigin: true,
		pathRewrite: { "^/odata": "" },
	})
)

app.listen(3000, () => {
	console.log("Proxy server is running on http://localhost:3000");
});
