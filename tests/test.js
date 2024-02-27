const { combination, combinationGenerator } = require("../dist/index")

test("tags and optionals", () => {
  const output = combination({
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
  const output = combination({
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

  for (const value of combinationGenerator({
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

test("large compile with sub patterns", () => {
  const output = []

  for (const value of combinationGenerator({
    pattern: "test the {sub}",
    data: {
      with: ["[large] compile", "Ghom [Krosmonaute]"],
      sub: ["[sub] {thing}"],
      thing: ["pattern [with {with}]", "thing"],
    },
  })) {
    output.push(value)
  }

  expect(output).toEqual([
    "test the pattern",
    "test the pattern with compile",
    "test the pattern with large compile",
    "test the sub pattern",
    "test the sub pattern with compile",
    "test the sub pattern with large compile",
    "test the pattern with Ghom",
    "test the pattern with Ghom Krosmonaute",
    "test the sub pattern with Ghom",
    "test the sub pattern with Ghom Krosmonaute",
    "test the thing",
    "test the sub thing",
  ])
})
