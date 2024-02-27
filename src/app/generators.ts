export interface CombinationOptions {
  pattern: string
  data: Record<string, string[]>
}

/**
 * Generate titles based on a pattern and tags data.
 * @param pattern The `{tags}` will be replaced by all the possible combinations of the `data[tag]` and the `[...]` are optional text parts.
 * @param data The tags and their possible values. Each value can be considered as a sub pattern.
 */
export function combination({ pattern, data }: CombinationOptions): string[] {
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

      if (!values) throw new Error(`Tag "${tag}" not found in data`)

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

/**
 * The same as {@link combination} but as a generator for large data sets or large output.
 * @param pattern The `{tags}` will be replaced by all the possible combinations of the `data[tag]` and the `[...]` are optional text parts.
 * @param data The tags and their possible values. Each value can be considered as a sub pattern.
 */
export function* combinationGenerator({ pattern, data }: CombinationOptions) {
  // Function to replace tags with their values and handle recursion
  function* expandPattern(
    pattern: string,
    data: Record<string, string[]>
  ): Generator<string> {
    const tagPattern = /{(\w+)}/ // Matches {tag} patterns
    const optionalPattern = /\[([^\[\]]*)\]/ // Matches optional patterns

    // Base case: if there are no more tags to replace, yield the pattern itself
    if (!tagPattern.test(pattern)) {
      yield pattern
      return
    }

    // Replace each tag with its possible values
    const match = tagPattern.exec(pattern)
    if (match) {
      const tag = match[1]
      const values = data[tag]

      if (!values) throw new Error(`Tag "${tag}" not found in data`)

      for (const value of values) {
        // Recursively expand the pattern with the value replaced
        for (const expandedValue of expandPattern(
          pattern.replace(tagPattern, value),
          data
        )) {
          // Handle optional sections for each expanded pattern
          let hasOptional = true
          let tempResult = expandedValue

          while (hasOptional) {
            const optionalMatch = optionalPattern.exec(tempResult)
            if (optionalMatch) {
              // Yield two versions: one with and one without the optional text
              yield tempResult.replace(optionalMatch[0], "") // without optional text
              yield tempResult.replace(optionalMatch[0], optionalMatch[1]) // with optional text

              // Replace the handled optional section with its content to avoid infinite loop
              tempResult = tempResult.replace(
                optionalMatch[0],
                optionalMatch[1]
              )
            } else {
              hasOptional = false
            }
          }

          // If the pattern has no optional parts left, yield the final result
          if (!optionalPattern.test(tempResult)) {
            yield tempResult
          }
        }
      }
    }
  }

  // Generator to yield unique titles, managing duplicates with a Set
  const seen = new Set<string>()
  for (const title of expandPattern(pattern, data)) {
    if (title.includes("[") || title.includes("]"))
      throw new Error(`Unmatched optional pattern of "${title}"`)

    const trimmedTitle = title.replace(/\s+/g, " ").trim()
    if (trimmedTitle && !seen.has(trimmedTitle)) {
      seen.add(trimmedTitle)
      yield trimmedTitle
    }
  }
}
