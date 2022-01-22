const assert = require("assert")
const config = require("../../config/keys")


describe("Test config file",()=>{
  it("should return a object for the configuration",async ()=>{
    assert.strictEqual("object",typeof config)

  })
})
