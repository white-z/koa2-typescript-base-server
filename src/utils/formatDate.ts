const weekMap = new Map( [
  [ 0, '星期日' ],
  [ 1, '星期一' ],
  [ 2, '星期二' ],
  [ 3, '星期三' ],
  [ 4, '星期四' ],
  [ 5, '星期五' ],
  [ 6, '星期六' ]
] );

/**
* 日期时间格式化
* @param {Date | String | timestamp} value
* @param {String} fmt 格式化模版
* @return {String} 格式化后的日期时间字符串
* @example formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
*/
export default function formatDate( value: string | number | Date, fmt: string = 'yyyy-MM-dd hh:mm:ss' ): string {
  if ( value === '' || value === undefined || value === null ) return '';
  if ( typeof value === 'string' ) {
    value = value.replace( /-/g, '/' );
  }
  const date = isDate(value) ? value : new Date( value );

  const normalData: any = {

    // 月份
    'M+': date.getMonth() + 1,

    // 日
    'd+': date.getDate(),

    // 小时
    'h+': date.getHours(),

    // 分
    'm+': date.getMinutes(),

    // 秒
    's+': date.getSeconds(),

    // 星期
    'w+': date.getDay(),

    // 季度
    'q+': Math.floor( ( date.getMonth() + 3 ) / 3 ),

    // 毫秒
    S: date.getMilliseconds()
  };

  if ( /(y+)/.test( fmt ) ) {
    fmt = fmt.replace(
      RegExp.$1,
      ( date.getFullYear() + '' ).substr( 4 - RegExp.$1.length )
    );
  }

  for ( const key in normalData ) {
    if ( key === 'w+' ) {
      fmt = fmt.replace( 'w', <string>weekMap.get( normalData[ key ] ) );
    } else if ( new RegExp( `(${key})` ).test( fmt ) ) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? normalData[ key ]
          : ( '00' + normalData[ key ] ).substr( ( '' + normalData[ key ] ).length )
      );
    }
  }

  return fmt;
}

export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.valueOf());
}

/**
 * 将传入的毫秒数转换成更容易阅读的时间
 * @param {Number} ms 毫秒
 * @returns {String} 例传入 22335 则返回 2.23s
 */
 export const getReadableTime = (ms: number): string => {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  let result: string;

  switch (true) {
    case ms < SECOND:
      result = `${ms}ms`;
      break;
    case ms < MINUTE:
      const seconds = ms / SECOND;
      result = `${trimDecimal(seconds)}s`;
      break;
    case ms < HOUR:
      const minutes = ms / MINUTE;
      result = `${trimDecimal(minutes)}m`;
      break;
    case ms < DAY:
      const hours = ms / HOUR;
      result = `${trimDecimal(hours)}h`;
      break;
    default:
      const days = ms / DAY;
      result = `${trimDecimal(days)}h`;
      break;
  }

  return `${result}`;
}

/**
 * 去除数字尾部的零并返回字符串表示的数字。
 * @param num - 要进行格式化的数字。
 * @returns 格式化后的数字。
 * @example
 * ```
 * trimDecimal(2.00) // "2"
 * trimDecimal(2.10) // "2.1"
 * trimDecimal(2.12345) // "2.12"
 * ```
 */
export const trimDecimal = (num: number): string => {
  // 将数字转换为指定位数的字符串，并去除尾部的零
  const trimmed = num.toFixed(2).replace(/\.?0*$/, '');

  // 如果字符串以小数点结尾，则添加一个零
  return trimmed.endsWith('.') ? trimmed + '0' : trimmed;
}
