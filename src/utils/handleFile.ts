import fs, { promises as fsPromises, WriteStream } from 'fs'
import config from '../../config'
import { File } from 'formidable'
import request from './request'
import formatDate from './formatDate'

const INVALID_REGEXP = process.platform === 'win32' ? /[\\/:"*?<>|]+/g : /[\//]/g

const handleFile = {
  /**
   * store file to disk
   * @param file formidable.File
   * @param dir directory
   * @param filename 
   * @returns {Promise<string>} file location
   * @example handleFile.store(file, './uploads', 'test.png')
   */
  store(file: File, dir: string = '', filename?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        dir = config.static + dir
        
        const name = filename || file.originalFilename || file.newFilename
        const location = dir + '/' + name.replace(INVALID_REGEXP, '_')

        let filehandle: fs.promises.FileHandle | null = null

        try {
          filehandle = await fsPromises.open(location, 'w+')
        } catch (error) {
          try {
            await fsPromises.mkdir(dir, { recursive: true })
            filehandle = await fsPromises.open(location, 'w+')
          } catch (error) {
            reject(error)
            return
          }
        }

        const reader = fs.createReadStream(file.filepath);
        const writer = filehandle.createWriteStream()

        reader.pipe(writer).on('finish', async () => {

          resolve(location)
          await fsPromises.unlink(file.filepath)
          filehandle && await filehandle.close()

        }).on('error', async (err) => {

          reject(err)
          await fsPromises.unlink(file.filepath)
          filehandle && await filehandle.close()

        })
        
      } catch (error) {
        reject(error)
      }
      
    })
  },
  /**
   * download file from url
   * @param url assets url
   * @param dir directory
   * @param filename 
   * @returns {Promise<string>} file location
   * @example handleFile.download('https://example.com/test.png', './uploads', 'mytest.png')
   */
  download(url: string, dir: string = '', filename?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await request<WriteStream>('get', url, null, {
          responseType: 'stream'
        })
  
        dir = config.static + dir
        const name = filename || url.split('/').pop() || 'unknown_file_' + formatDate(new Date(), 'yyyy-MM-dd_hh:mm:ss')
        const location = dir + '/' + name.replace(INVALID_REGEXP, '_')
        let filehandle: fs.promises.FileHandle | null = null
        try {
          filehandle = await fsPromises.open(location, 'w+')
        } catch (error) {
          try {
            await fsPromises.mkdir(dir, { recursive: true })
            filehandle = await fsPromises.open(location, 'w+')
          } catch (error) {
            reject(error)
            return
          }
        }
        res.pipe(filehandle.createWriteStream()).on('finish', async () => {
          resolve(location)
          filehandle && await filehandle.close()
        }).on('error', async (err) => {
          reject(err)
          filehandle && await filehandle.close()
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default handleFile
