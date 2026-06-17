import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function tokenize(text: string, n: number = 2): string[] {
  const cleanText = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]/g, '')
  const tokens: string[] = []
  
  if (cleanText.length === 0) return tokens
  
  if (cleanText.length <= n) {
    tokens.push(cleanText)
    return tokens
  }
  
  for (let i = 0; i <= cleanText.length - n; i++) {
    tokens.push(cleanText.substring(i, i + n))
  }
  
  return tokens
}

function getWordFrequency(tokens: string[]): Record<string, number> {
  const freq: Record<string, number> = {}
  for (const token of tokens) {
    freq[token] = (freq[token] || 0) + 1
  }
  return freq
}

function cosineSimilarity(vec1: Record<string, number>, vec2: Record<string, number>): number {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)])
  
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0
  
  for (const key of allKeys) {
    const val1 = vec1[key] || 0
    const val2 = vec2[key] || 0
    
    dotProduct += val1 * val2
    norm1 += val1 * val1
    norm2 += val2 * val2
  }
  
  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 1
  if (set1.size === 0 || set2.size === 0) return 0
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

export function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0
  
  const clean1 = text1.toLowerCase().trim()
  const clean2 = text2.toLowerCase().trim()
  
  if (clean1 === clean2) return 1
  
  const tokens1 = tokenize(clean1, 2)
  const tokens2 = tokenize(clean2, 2)
  
  const set1 = new Set(tokens1)
  const set2 = new Set(tokens2)
  
  const freq1 = getWordFrequency(tokens1)
  const freq2 = getWordFrequency(tokens2)
  
  const cosine = cosineSimilarity(freq1, freq2)
  const jaccard = jaccardSimilarity(set1, set2)
  
  const maxLen = Math.max(clean1.length, clean2.length)
  const editDistance = levenshteinDistance(clean1, clean2)
  const editSimilarity = maxLen === 0 ? 1 : 1 - editDistance / maxLen
  
  const similarity = cosine * 0.5 + jaccard * 0.3 + editSimilarity * 0.2
  
  return Math.max(0, Math.min(1, similarity))
}

export function calculateRequirementSimilarity(
  newTitle: string,
  newDescription: string,
  existingTitle: string,
  existingDescription: string
): { similarity: number; matchedFields: string[] } {
  const matchedFields: string[] = []
  
  const titleSimilarity = calculateTextSimilarity(newTitle, existingTitle)
  const descSimilarity = calculateTextSimilarity(newDescription, existingDescription)
  
  if (titleSimilarity > 0.5) {
    matchedFields.push('title')
  }
  if (descSimilarity > 0.4) {
    matchedFields.push('description')
  }
  
  const combinedTextNew = `${newTitle} ${newDescription}`.trim()
  const combinedTextExisting = `${existingTitle} ${existingDescription}`.trim()
  const overallSimilarity = calculateTextSimilarity(combinedTextNew, combinedTextExisting)
  
  return {
    similarity: overallSimilarity,
    matchedFields
  }
}
