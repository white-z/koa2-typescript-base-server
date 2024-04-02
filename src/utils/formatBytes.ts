/**
  将给定的字节数转换为可读的字符串表示形式。
  @param {number} bytes - 要格式化的字节数。
  @param {number} [decimals=2] - 要在结果中包含的小数位数。
  @return {string} - 给定字节数的可读字符串表示形式。
  @throws {Error} - 如果输入“bytes”或“decimals”不是数字，或如果“decimals”为负数。
*/
export default function formatBytes(bytes: number, decimals: number = 2): string {
  // Check if the input `bytes` is a number and not NaN
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    throw new Error('Invalid parameter "bytes".');
  }

  // Check if the input `decimals` is a number and not NaN, and also that it's not negative
  if (typeof decimals !== 'number' || isNaN(decimals) || decimals < 0) {
    throw new Error('Invalid parameter "decimals".');
  }

  // If `bytes` is 0, return "0 Bytes"
  if (bytes === 0) {
    return '0 Bytes';
  }

  // If `bytes` is negative, negate it and recursively call `formatBytes`
  if (bytes < 0) {
    return '-' + formatBytes(-bytes, decimals);
  }

  // If `bytes` is less than 1024, return `bytes` + " Bytes"
  if (bytes < 1024) {
    return `${bytes} Bytes`;
  }

  // An array of sizes to represent the formatted string
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  // If `bytes` is too big, return "Too big"
  if (bytes >= 1024 ** (sizes.length - 1)) {
    return 'Too big';
  }

  // Calculate the index of the size to use in the `sizes` array
  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  // Calculate the value to use for the formatted string
  const result = bytes / 1024 ** sizeIndex;

  // Use `Number.toLocaleString` to get the fixed decimal string representation
  // with the specified number of `decimals`
  return result.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + ' ' + sizes[Math.min(sizeIndex, sizes.length - 1)];
}