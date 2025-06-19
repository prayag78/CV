import fs from 'fs'
import path from 'path'

const latexDir = path.join(__dirname, 'latex')

// Find all .tex files like 0006.tex, 0007.tex...
const templateFiles = fs.readdirSync(latexDir).filter(file => file.endsWith('.tex'))

export const templates = templateFiles.map((file) => {
  const name = path.basename(file, '.tex') // e.g., "0006"
  const defaultLatex = fs.readFileSync(path.join(latexDir, file), 'utf8')

  return {
    name,
    thumbnailUrl: `/temimg/${name}.png`, // local public folder URL
    defaultLatex,
    isPublic: true,
  }
})
