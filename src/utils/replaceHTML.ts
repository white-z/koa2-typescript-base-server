/**
 * 将指定字符替换为html特殊字符
 * @param str HTML字符串
 * @returns string 转义后的字符串
 */
export default function replaceHTML(str: string) {
  if(typeof str !== 'string') {
    return '';
  }
  if(!str) {
    return '';
  }
  const RexStr = /\<|\>|\"|\'|\&/g
  str = str.replace(RexStr, (MatchStr) => {
    switch (MatchStr) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      case "'":
        return "&#39;";
      case "&":
        return "&amp;";
      default:
        return ''
    }
  })
  return str;
}
