const { compileTags, largeCompileTags } = require("../dist/index")

test("tags and optionals", () => {
  const output = compileTags({
    pattern: "test a {thing} [for a {reason} [and a {reason}]]",
    data: {
      thing: ["thing", "stuff"],
      reason: ["reason", "cause"],
    },
  })

  expect(output).toEqual([
    "test a thing",
    "test a thing for a reason",
    "test a thing for a reason and a reason",
    "test a thing for a reason and a cause",
    "test a thing for a cause",
    "test a thing for a cause and a reason",
    "test a thing for a cause and a cause",
    "test a stuff",
    "test a stuff for a reason",
    "test a stuff for a reason and a reason",
    "test a stuff for a reason and a cause",
    "test a stuff for a cause",
    "test a stuff for a cause and a reason",
    "test a stuff for a cause and a cause",
  ])
})

test("sub patterns", () => {
  const output = compileTags({
    pattern: "test the {sub}",
    data: {
      sub: ["[sub] {thing}"],
      thing: ["pattern", "thing"],
    },
  })

  expect(output).toEqual([
    "test the pattern",
    "test the sub pattern",
    "test the thing",
    "test the sub thing",
  ])
})

test("large compile", () => {
  const output = []

  for (const value of largeCompileTags({
    pattern: "test the {sub}",
    data: {
      sub: ["[sub] {thing}"],
      thing: ["pattern", "thing"],
    },
  })) {
    output.push(value)
  }

  expect(output).toEqual([
    "test the pattern",
    "test the sub pattern",
    "test the thing",
    "test the sub thing",
  ])
})
