import * as serverBuild from "@remix-run/dev/server-build"
import { createRequestHandler } from "@remix-run/express"
import compression from "compression"
import express from "express"
import latestVersion from "latest-version"
import morgan from "morgan"
import open from "open"
import { join } from "path"
import { semverCompare } from "~/components/util"
import pkg from "./package.json"
import { parseArgs } from "./src/analyzer/args.server"

const args = parseArgs()

;(async () => {
  const currentV = pkg.version
  let updateMessage = ""
  try {
    const latestV = await latestVersion(pkg.name)

    // Soft clear the console
    process.stdout.write("\u001b[2J\u001b[0;0H")
    console.log()

    updateMessage =
      latestV && semverCompare(latestV, currentV) === 1
        ? ` [!] Update available: ${latestV}

To update, run:

  npx git-truck@latest

Or to install globally:

  npm install -g git-truck@latest

`
        : " (latest)"
  } catch (e) {}
  console.log(`Git Truck version ${currentV}${updateMessage}`)

  if (args.h || args.help) {
    console.log()
    console.log(`See

  ${pkg.homepage}

for usage instructions.`)
    console.log()
    process.exit(0)
  }

  const app = express()

  app.use(compression())

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable("x-powered-by")

  const staticAssetsPath = join(__dirname, "../public/build")
  // Remix fingerprints its assets so we can cache forever.
  app.use("/build", express.static(staticAssetsPath, { immutable: true, maxAge: "1y" }))

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static(join(__dirname, "../public"), { maxAge: "1h" }))

  app.use(morgan("tiny"))

  app.all(
    "*",
    createRequestHandler({
      build: serverBuild,
      mode: process.env.NODE_ENV,
    })
  )

  let devServerPort: number | null = null
  let userHasProvidedPort = false
  let minPort = 3000

  if (args.port && !isNaN(parseInt(args.port))) {
    minPort = parseInt(args.port)
    userHasProvidedPort = true
  }

  if (process.env["PORT"] && !isNaN(parseInt(process.env["PORT"]))) {
    devServerPort = parseInt(process.env["PORT"])
  }

  const getPortLib = await import("get-port")
  const getPort = getPortLib.default
  const port = await getPort({
    port: devServerPort ?? [...(!userHasProvidedPort ? [3000] : []), ...getPortLib.portNumbers(minPort, minPort + 1000)],
  })
  app.listen(port).once("listening", () => printOpen(port))
})()

async function printOpen(port: number) {
  console.log()
  console.log(`Now listening on port ${port}`)
  if (process.env.NODE_ENV !== "development") {
    const url = `http://localhost:${port}`
    console.log(`Opening ${url} in your browser`)
    await open(url)
  }
}
