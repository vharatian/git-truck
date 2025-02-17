/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  server: "./server.ts",
  ignoredRouteFiles: [".*", "components/*"],
  serverDependenciesToBundle: [
    "styled-components",
    "d3-hierarchy",
    "@react-aria/utils",
    "is-binary-path",
    "yargs-parser",
    "gitignore-parser",
    "latest-version"
  ],
  appDirectory: "src",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002
}
