/**
 * 用于获取入参对象的类型字符串
 * @param obj {any} 
 * @returns {string} Lower Case
 */
export default function typeOf(obj: any): string {
  // 定义变量 `type` 为传入对象的类型
  const type = typeof obj;

  // 如果对象的类型不是 'object'，直接返回
  if (type !== 'object') {
    return type;
  }

  // 获取对象的类型字符串
  const match = Object.prototype.toString.call(obj).match(/\s(\w+)/);

  // 如果匹配到类型，返回类型的小写字母版本；否则返回 'object'
  return match ? match[1].toLowerCase() : 'object';
}