# Programmatic SEO Library for Node.js

This Node.js library is designed to empower developers with the tools needed to automate and enhance their SEO efforts programmatically.

## Installation

To install the programmatic SEO library, use npm:

```bash
npm install @ghom/programmatic-seo
```

## Usage

Here's a quick example to get you started:

```js
import { compileTags } from "@ghom/programmatic-seo"

const output = compileTags({
  pattern: "{verb} [{adjective}] approach of {noun}",
  data: {
    verb: ["learn", "explore"],
    adjective: ["exciting", "innovative"],
    noun: ["programming", "[web] development"]
  }
})

console.log(output)

// Output:
// [
//   "learn exciting approach of programming",
//   "learn exciting approach of development",
//   "learn exciting approach of web development",
//   "learn innovative approach of programming",
//   "learn innovative approach of development",
//   "learn innovative approach of web development",
//   "explore exciting approach of programming",
//   "explore exciting approach of development",
//   "explore exciting approach of web development",
//   "explore innovative approach of programming",
//   "explore innovative approach of development",
//   "explore innovative approach of web development"
// ]
```

## API Documentation

### `compileTags(options: CompileTagOptions): string[]`

Generates a list of strings based on the provided pattern and data. `CompileTagOptions` includes `pattern` and `data`.

## Contributing

We welcome contributions from the community! If you'd like to contribute to the project, make a PR 😉

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.