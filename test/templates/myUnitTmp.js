import Vue from 'vue'
import <%NAME%> from '<%PATH%>'

describe('custom Gue test file', () => {
  it('here is a test', () => {
    const defaultData = <%NAME%>.data()
    expect(defaultData.gue).toBe('cool!')
  })

})