import Result from '../core/result'
import handleFile from '../utils/handleFile'

const fileUpload = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const files = ctx.request.files
  if(files && files.file) {

    const file = files.file instanceof Array ? files.file : [files.file]

    const filenames = await Promise.all(file.map(async (el) => {
      return await handleFile.store(el)
    }))
    
    ctx.body = Result.success({msg: '上传成功', data: filenames})
    return filenames
  } else {
    ctx.body = Result.error({msg: '请上传文件'})
  }
}

export default {
  fileUpload
}