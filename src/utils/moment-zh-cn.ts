import 'moment/locale/zh-cn'
import moment from './moment'

moment.updateLocale('zh-cn', {
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日 Ah点mm分',
    LLLL: 'YYYY年MMMD日 dddd Ah点mm分',
    l: 'YYYY-M-D',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日 HH:mm',
    llll: 'YYYY年MMMD日 dddd HH:mm'
  },
  calendar: {
    sameDay: '[今天] LT',
    nextDay: '[明天] LT',
    lastDay: '[昨天] LT',
    sameElse (this: moment.Moment, now: moment.Moment) {
      return this.year() === now.year() ? 'MMMD日 LT' : 'l LT'
    }
  }
})
