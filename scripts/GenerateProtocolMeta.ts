const fs = require("fs")
const path = require("path")
const csv = require("csv-parser")
const prettier = require("prettier")
const prettierConfig = JSON.parse(fs.readFileSync(".prettierrc.json", "utf8"))

/**
 * Path to source of protocols meta
 */
const inputFilePath = "./meta/protocols.csv"

/**
 * Path to where metas will be saved
 */
const outputPath = path.join("src", "data", "protocols")

/**
 * Clean output directory to start fresh.
 */
const cleanOutputDirectory = () => {
  fs.readdir(outputPath, (err, files) => {
    if (err) throw err

    for (const file of files) {
      fs.unlink(path.join(outputPath, file), (err) => {
        if (err) throw err
      })
    }
  })
}

/**
 * Parce .csv file
 * @returns Promise that resolves to an array of protocols
 */
const processFile = () =>
  new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(inputFilePath)
      .pipe(csv({ separator: "," }))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results)
      })
  })

const main = async () => {
  cleanOutputDirectory()

  console.log("Loading", inputFilePath)
  const protocols = await processFile()
  console.log(`Read ${protocols.length} protocols`)

  const protocolsPaths = protocols.map((protocol) => {
    // Build file content
    const outputRaw = `
    import { CoveredProtocolMeta } from "./index"

    const meta: CoveredProtocolMeta = ${JSON.stringify(protocol)}

    export default meta
    `
    const outputPretty = prettier.format(outputRaw, { parser: "babel-ts", ...prettierConfig })

    // Build filename
    const slugName = protocol.name.replace(/\W+/g, "_").toLowerCase()
    const filename = path.join("src", "data", "protocols", `${slugName}.ts`)

    // Write file
    fs.writeFileSync(filename, outputPretty)
    console.log(`Protocol ${protocol.name} saved to ${filename}`)

    return {
      path: filename,
      name: slugName,
    }
  })

  // Build index.ts
  const indexOutputRaw = `
  ${protocolsPaths.reduce((str, item) => str + `import ${item.name} from "./${item.name}"\r\n`, "")}

  export type CoveredProtocolMeta = {
    id: string
    tag: string;
    name?: string
    website?: string
    logo?: string
    description?: string
    agreement?: string
    agreement_hash?: string
    agent?: string
    pay_year?: string
    pay_contracts?: string
  }

  type CoveredProtocolsMetas = {
    [key: string]: CoveredProtocolMeta
  }

  const coveredProtocolMetas: CoveredProtocolsMetas = {
    ${protocolsPaths.map((item) => `[${item.name}.id]: ${item.name}`)}
  }

  export default coveredProtocolMetas
  `
  const indexOutputPretty = prettier.format(indexOutputRaw, { parser: "babel-ts", ...prettierConfig })
  const indexPath = path.join(outputPath, "index.ts")
  fs.writeFileSync(indexPath, indexOutputPretty)

  console.log(`Meta index saved to ${indexPath}`)
}

main()
