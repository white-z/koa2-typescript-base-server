/**
 * 字节数转换为合适的单位
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns string
 */
export default function formatBytes(bytes: number, decimals = 2): string {
  if ( bytes === 0 ) return '0Bytes'
  if ( bytes > Number.MAX_SAFE_INTEGER ) return 'Too big'
  if ( bytes < Number.MIN_SAFE_INTEGER ) return 'Too small'
  if ( bytes < 0 ) return '-' + formatBytes(-bytes, decimals)

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]

}