module.exports = `
import Vue from 'vue'
import <%NAME%> from '<%PATH%>'

describe('created method', () => {
  it('sets the correct default data', () => {
    const defaultData = <%NAME%>.data()
    expect(defaultData.message).toBe('hello!')
  })

  it('correctly sets the message when created', () => {
    const vm = new Vue(<%NAME%>).$mount()
    expect(vm.message).toBe('bye!')
  })

})
`;
