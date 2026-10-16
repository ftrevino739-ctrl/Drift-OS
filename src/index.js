import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { hostname } from "node:os";
import fs from "node:fs";
import path from "node:path";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const rootPath = fileURLToPath(new URL("../", import.meta.url));
const publicPath = fileURLToPath(new URL("../public/", import.meta.url));
const rootIndexPath = path.join(rootPath, "index.html");
const pubIndexPath = path.join(publicPath, "index.html");

// SHA-256 of temporary password "1" (change later)
const TEMP_PASS_HASH = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";

function ensureFullIndex() {
	try {
		if (!fs.existsSync(rootIndexPath)) return;
		const rs = fs.statSync(rootIndexPath).size;
		const ps = fs.existsSync(pubIndexPath) ? fs.statSync(pubIndexPath).size : 0;
		if (rs > 50000 && rs > ps) {
			fs.copyFileSync(rootIndexPath, pubIndexPath);
			console.log(`Synced root index.html -> public/index.html (${rs} bytes)`);
		}
	} catch (e) {
		console.warn("index sync skipped", e);
	}
}

function patchHtml(html) {
	// Allow scrolling the gate page
	html = html.replace(
		/#gate\{position:fixed;inset:0;z-index:999999;background:#000;color:#e8e8e8;font-family:ui-sans-serif,system-ui,sans-serif;overflow:hidden;display:flex;flex-direction:column\}/,
		"#gate{position:fixed;inset:0;z-index:999999;background:#000;color:#e8e8e8;font-family:ui-sans-serif,system-ui,sans-serif;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;display:block}"
	);
	html = html.replace(
		/\.gate-ui\{position:relative;z-index:2;max-width:720px;margin:auto;padding:28px 22px 40px;text-align:center\}/,
		".gate-ui{position:relative;z-index:2;max-width:720px;margin:0 auto;padding:28px 22px 100px;text-align:center}"
	);
	// Temporary password = "1"
	html = html.replace(/passwordHash:'[a-f0-9]{64}'/g, "passwordHash:'" + TEMP_PASS_HASH + "'");
	html = html.replace(/passwordHash:"[a-f0-9]{64}"/g, 'passwordHash:"' + TEMP_PASS_HASH + '"');
	return html;
}

ensureFullIndex();

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
	allow_udp_streams: false,
	hostname_blacklist: [/example\.com/],
	dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
			.on("request", (req, res) => {
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
				handler(req, res);
			})
			.on("upgrade", (req, socket, head) => {
				if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
				else socket.end();
			});
	},
});

fastify.get("/", async (_req, reply) => {
	ensureFullIndex();
	let file = null;
	if (fs.existsSync(rootIndexPath) && fs.statSync(rootIndexPath).size > 50000) file = rootIndexPath;
	else if (fs.existsSync(pubIndexPath)) file = pubIndexPath;
	if (!file) return reply.code(404).send("index.html missing");
	const html = patchHtml(fs.readFileSync(file, "utf8"));
	return reply.type("text/html; charset=utf-8").send(html);
});

fastify.register(fastifyStatic, {
	root: publicPath,
	decorateReply: true,
});

fastify.register(fastifyStatic, {
	root: scramjetPath,
	prefix: "/scram/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: libcurlPath,
	prefix: "/libcurl/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: baremuxPath,
	prefix: "/baremux/",
	decorateReply: false,
});

fastify.setNotFoundHandler((_req, reply) => {
	return reply.code(404).type("text/html").sendFile("404.html");
});

fastify.server.on("listening", () => {
	const address = fastify.server.address();
	console.log("Listening on:");
	console.log(`\thttp://localhost:${address.port}`);
	console.log(`\thttp://${hostname()}:${address.port}`);
	console.log(`Root index: ${fs.existsSync(rootIndexPath) ? fs.statSync(rootIndexPath).size + " bytes" : "missing"}`);
	console.log("Temp gate password: 1 (HWID 1)");
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
	console.log("SIGTERM signal received: closing HTTP server");
	fastify.close();
	process.exit(0);
}

let port = parseInt(process.env.PORT || "");
if (isNaN(port)) port = 8080;

fastify.listen({
	port: port,
	host: "0.0.0.0",
});
