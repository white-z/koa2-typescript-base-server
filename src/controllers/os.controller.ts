import checkDiskSpace from 'check-disk-space'
import os from 'os'
import Result from '../core/result'
import sleep from '../utils/sleep'
import formatBytes from '../utils/formatBytes'

// 获取当前版本号和运行环境
const getVersion = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  ctx.body = Result.success({data: {
    version: ctx.props.version,
    env: process.env.NODE_ENV || 'unknown'
  }});
}

/**
 * 获取CPU使用情况
 */
const getCPU = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const instantaneousCpuTime = () => {
    let idleCpu = 0;
    let tickCpu = 0;
    const cpus = os.cpus();
    const length = cpus.length;

    let i = 0;
	  while(i < length) {
      let cpu = cpus[i];

      for (const type in cpu.times) {
        tickCpu += Reflect.get(cpu.times, type);
      }

      idleCpu += cpu.times.idle;
      i++;
    }

    const time = {
      idle: idleCpu / cpus.length,  // 单核CPU的空闲时间
      tick: tickCpu / cpus.length,  // 单核CPU的总时间
    };
	  return time;
  }
  const startQuantize = instantaneousCpuTime();
  await sleep(1000);
  const endQuantize = instantaneousCpuTime();
  const idleDifference = endQuantize.idle - startQuantize.idle;
  const tickDifference = endQuantize.tick - startQuantize.tick;
  const diff = (1 - (idleDifference / tickDifference));

  ctx.body = Result.success({data: {
    use: (diff * 100).toFixed(2) + '%',
    avg: os.loadavg().map(load => load / os.cpus().length)
  }})
}

/**
 * 获取内存使用情况
 */
const getHeap = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  // 获取当前Node内存堆栈情况
  const { rss, heapUsed, heapTotal } = process.memoryUsage();
  // 获取系统空闲内存
  const sysFree = os.freemem();
  // 获取系统总内存
  const sysTotal = os.totalmem();
  const res = {
    sys: ((1 - sysFree / sysTotal) * 100).toFixed(2) + '%',  // 系统内存占用率
    heap: ((heapUsed / heapTotal) * 100).toFixed(2) + '%',   // Node堆内存占用率
    node: ((rss / sysTotal) * 100).toFixed(2) + '%',         // Node占用系统内存的比例
  }
  ctx.body = Result.success({data: res})
}

/**
 * 获取磁盘空间
 */
const diskSpace = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const dir = process.platform === 'win32' ? 'C:\\' : '/'
  const res = await checkDiskSpace(dir)
  ctx.body = Result.success({data: {
    free: formatBytes(res.free),
    size: formatBytes(res.size)
  }})
}

export default {
  getCPU,
  getHeap,
  diskSpace,
  getVersion
}
