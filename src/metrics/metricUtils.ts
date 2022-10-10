import gitcolors from "github-colors/colors.json"
import langMap from "lang-map"

interface ColorResult {
  lang: string
  color: string | null
}

const lowercasedColors = new Map<string, ColorResult>()
for (const [key, value] of Object.entries(gitcolors)) {
  lowercasedColors.set(key.toLowerCase(), {
    ...value,
    lang: key,
  })
}

export function getColorFromExtension(extension: string) {
  const langMatches = langMap.languages(extension.toLowerCase())
  const langs = []
  if (!langMatches) return null
  let colorResult = null
  // Loop through lang resuts
  for (const langResult of langMatches) {
    // If we have a color for the language, return it
    const match = lowercasedColors.get(langResult)
    if (match) {
      colorResult = match
      langs.push(colorResult.lang)
      break
    }
  }
  if (!colorResult) return null
  return colorResult.color
}

export function getRandomColor(): string{
  let index = getRandomInt(0, lowercasedColors.size)
  let key = [...lowercasedColors.keys()][index]
  let color = lowercasedColors.get(key)
  return color?.color!
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class SpectrumTranslater {
    readonly scale: number
    readonly offset: number
    readonly target_max: number
    readonly target_min: number
  
    constructor(input_min: number, input_max: number, target_min: number, target_max: number) {
      this.scale = (target_max - target_min) / (input_max - input_min)
      this.offset = input_min * this.scale - target_min
      this.target_max = target_max
      this.target_min = target_min
    }
  
    translate(input: number) {
      return input * this.scale - this.offset
    }
  
    inverseTranslate(input: number) {
      return this.target_max - this.translate(input) + this.target_min
    }
}