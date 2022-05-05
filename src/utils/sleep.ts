/**
 * 延时等待
 * @param ms 延时时间
 */
export default function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}