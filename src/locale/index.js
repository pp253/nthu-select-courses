import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './lang/en'
import zhTW from './lang/zh_tw'

Vue.use(VueI18n)

export const availableLangs = [
  {
    text: '中文',
    value: 'zh_tw'
  },
  {
    text: 'English',
    value: 'en'
  }
]

export const locales = {
  en: en,
  zh_tw: zhTW
}

export default new VueI18n({
  locale: 'zh_tw', // set locale
  fallbackLocale: 'zh_tw',
  messages: locales, // set locale messages
  silentTranslationWarn: true
})
