import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en.json'
import zhTW from './zh_tw.json'

Vue.use(VueI18n)

const locales = {
  en: en,
  zh_tw: zhTW
}

export default new VueI18n({
  locale: 'zh_tw', // set locale
  messages: locales // set locale messages
})
