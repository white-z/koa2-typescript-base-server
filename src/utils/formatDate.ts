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
* @param {Date} value 可以被 new Date(value) 解析的时间格式，如 Date()、2022/04/26、2022-04-26 12:00 等
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