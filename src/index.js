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

// SHA-256("0") — temporary gate password
const TEMP_PASS_HASH = "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9";

function loadAndPatchIndex() {
	let file = null;
	if (fs.existsSync(rootIndexPath) && fs.statSync(rootIndexPath).size > 50000) file = rootIndexPath;
	else if (fs.existsSync(pubIndexPath)) file = pubIndexPath;
	if (!file) return null;
	let html = fs.readFileSync(file, "utf8");

	// Scrollable gate
	html = html.split("overflow:hidden;display:flex;flex-direction:column}").join(
		"overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;display:block}"
	);
	html = html.split("margin:auto;padding:28px 22px 40px;text-align:center}").join(
		"margin:0 auto;padding:28px 22px 100px;text-align:center}"
	);

	// Force password hash = SHA-256 of "0"
	html = html.replace(/passwordHash\s*:\s*['"][a-fA-F0-9]{64}['"]/g, "passwordHash:'" + TEMP_PASS_HASH + "'");

	return html;
}

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

// Always serve the FULL root WebOS (inline CSS/JS) — never the thin public shell
const sendIndex = async (_req, reply) => {
	const html = loadAndPatchIndex();
	if (!html) return reply.code(404).send("index.html missing at repo root");
	return reply.type("text/html; charset=utf-8").send(html);
};
fastify.get("/", sendIndex);
fastify.get("/index.html", sendIndex);

// Static assets only — do NOT auto-serve index.html for "/"
fastify.register(fastifyStatic, {
	root: publicPath,
	decorateReply: true,
	index: false,
	wildcard: false,
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
	const html = loadAndPatchIndex();
	console.log("Listening on:");
	console.log(`\thttp://localhost:${address.port}`);
	console.log(`\thttp://${hostname()}:${address.port}`);
	console.log(`Index bytes: ${html ? html.length : 0}`);
	console.log("Gate password: 0 | HWID: 1");
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
