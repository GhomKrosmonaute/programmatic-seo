const { compileTags } = require("../dist/index")

test("test", () => {
  const titles = compileTags(
    "test a {thing} [for a {reason} [and a {reason}]]",
    {
      thing: ["thing", "stuff"],
      reason: ["reason", "cause"],
    }
  )

  expect(titles).toEqual([
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
