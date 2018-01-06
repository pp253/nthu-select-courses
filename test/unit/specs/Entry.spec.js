import Vue from 'vue'
import Entry from '@/components/Entry'

describe('Entry.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Entry)
    const vm = new Constructor().$mount()

    /*
    expect(vm.$el.querySelector('input[name=input-auth_img]'))
    .not.equal('Welcome to Your Vue.js App')
    */
  })
})
