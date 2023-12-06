import { Web5 } from "@web5/api"
/*
Needs globalThis.crypto polyfill.
This is *not* the crypto you're thinking of.
It's the original crypto...CRYPTOGRAPHY.
*/
import { webcrypto } from "node:crypto"

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto
const { web5, did: myDid } = await Web5.connect()

const mseProtocolDefinition = {
	protocol: "https://digitaldreamcrafters.dev/mse-protocol",
	published: true,
	types: {
		art: {
			schema: "https://digitaldreamcrafters.dev/art",
			dataFormats: ["application/json"],
		},
	},
	structure: {
		art: {
			$actions: [
				{ who: "a_viewer", can: "read" },
				{ who: "creator", of: "art", can: "write" },
				{ who: "creator", of: "art", can: "read" },
			],
		},
	},
}

async function installProtocol() {
	return await web5.dwn.protocols.configure({
		message: {
			definition: mseProtocolDefinition,
		},
	})
}
