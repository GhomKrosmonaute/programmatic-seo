/**
 * Generate titles based on a pattern and tags data.
 * @param pattern The {tags} will be replaced by all the possible combinations of the data[tag] and the [] are optional text parts.
 * @param data The tags and their possible values. Each value can be considered as a sub pattern.
 *
 * @example ```js
 * const data = {
 *   principalTerms: ['a [{color}] cat', 'a [{color}] dog'],
 *   color: ['blue', 'red'],
 *   place: ['cat', 'dog'],
 *   forOptional: ['emotional support', 'companionship'],
 *   andOptional: ['a walk', 'a run']
 * }
 *
 * const pattern = "{principalTerms} from {place} [for {forOptional} [and {andOptional}]]"
 * ```
 */
export function compileTags(
  pattern: string,
  data: Record<string, string[]>
): string[] {
  // Function to replace tags with their values and handle recursion
  function expandPattern(
    pattern: string,
    data: Record<string, string[]>
  ): string[] {
    const tagPattern = /{(\w+)}/ // Matches {tag} patterns
    const optionalPattern = /\[([^\[\]]*)]/g // Matches optional patterns

    // Base case: if there are no more tags to replace, return the pattern itself
    if (!tagPattern.test(pattern)) {
      return [pattern]
    }

    let results: string[] = []

    // Replace each tag with its possible values
    const match = tagPattern.exec(pattern)
    if (match) {
      const tag = match[1]
      const values = data[tag]
      values.forEach((value) => {
        // Recursively expand the pattern with the value replaced
        const expandedValues = expandPattern(
          pattern.replace(tagPattern, value),
          data
        )
        results = results.concat(expandedValues)
      })
    }

    // After replacing tags, handle optional sections
    let finalResults: string[] = []
    results.forEach((result) => {
      let options = [result]
      let match: RegExpExecArray | null
      while ((match = optionalPattern.exec(result))) {
        const optionalText = match[1]
        // For each optional section, generate two versions: one with and one without the optional text
        options = options.flatMap((option) => [
          option.replace(match![0], ""), // without optional text
          option.replace(match![0], optionalText), // with optional text
        ])
      }
      finalResults = finalResults.concat(options)
    })

    // Remove duplicates
    return Array.from(new Set(finalResults))
  }

  // Initial expansion of the pattern
  return expandPattern(pattern, data)
    .map((title) => title.replace(/\s+/g, " ").trim())
    .filter((title) => title !== "")
}
