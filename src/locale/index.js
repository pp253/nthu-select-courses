import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
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

export const messages = {
  en: en,
  zh_tw: zhTW
}

export const i18n = new VueI18n({
  locale: 'zh_tw', // set locale
  fallbackLocale: 'zh_tw',
  messages: messages, // set locale messages
  silentTranslationWarn: true
})

export function setI18nLanguage(lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  Vue.config.lang = lang
  return lang
}

export default i18n
