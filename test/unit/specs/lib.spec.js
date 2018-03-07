import * as utils from '@/lib/utils'

describe('lib/utils', () => {
  it('`htmlEncode` should return html encoded string.', () => {
    expect(utils.htmlEncode("I'm a student.")).equal(
      'I&#39;m&nbsp;a&nbsp;student.'
    )
  })

  it('`toArray` should return the array of the value of the given object.', () => {
    expect(utils.toArray({ a: 1, b: 2 })).equal([1, 2])
  })
})
