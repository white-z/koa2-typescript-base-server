import log from './log4js'
/** 数字转千分符
 * @param { Number | String } value 要转换千分符的值 
 * @returns {String} 转换后的值 '123,456,789.00'
 * @example thousandSeparator(123456789.00)
 */
export const toThousandSeparator = (value: number | string): string => {
  if (typeof value === 'number') {
    value = value.toString()
  }
  if(value !== 'string') {
    log.warn('toThousandSeparator: value must be a string or a number')
    return value
  }
  if (value.indexOf('.') > -1) {
    const [int, float] = value.split('.')
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + float
  }
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 千分位转数字
 * @param value 千分位字符串
 * @returns {Number} 转换后的数字 123456789.00
 * @example thousandSeparator('123,456,789.00')
 */
export const parseThousandSeparator = (value: string): number => {
  if(typeof value !== 'string') {
    log.warn('parseThousandSeparator: value is not string')
    return value
  }
  value = value.replace(/,/g, '')
  return parseFloat(value)
}
