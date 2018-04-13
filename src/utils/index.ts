import moment from './moment'
import './moment-zh-cn'

/**
 * 将 Unix Timestamp 或 ISO 8601 或 RFC 2822 格式的时间字符串格式化成人性化格式
 *
 * @export
 * @param {string | number} time 原始时间字符串（ISO 8601 或 RFC 2822 格式）
 * @param {string} format 强制指定格式，不指定则为人性化时间
 * @returns {string} 人性化时间字符串
 */
export function formatTime (time: string | number, format = ''): string {
  if (typeof time === 'string' || typeof time === 'number') {
    const timeStr = String(time)
    const dateTime = timeStr.match(/^\d+$/g) ? moment(Number(timeStr) * 1000) : moment(timeStr)
    if (format) return dateTime.format(format)
    if (dateTime.isBefore(moment().subtract(1, 'hour'))) {
      return dateTime.calendar()
    } else {
      return dateTime.fromNow()
    }
  } else {
    return ''
  }
}

export async function sleep (milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds)
  })
}
