import { Files } from "formidable";
import Result from "../core/result"
import typeOf from "../utils/typeOf"

export interface RuleItem {
  /** 是否必填 */
  required?: boolean;
  /** 需要test校验的正则表达式 */
  pattern?: RegExp;
  /** 自定义验证器 */
  validator?: (value: any, rule: RuleItem) => string | void;
  /** 验证失败时的提示信息 */
  message?: string;
  /** 为字符串时的最大长度或为数字时的最大值 */
  max?: number;
  /** 为字符串时的最小长度或为数字时的最小值 */
  min?: number;
  /** instanceof */
  type?: Function
}

export interface RulesMap {
  [name: string]: RuleItem | RuleItem[];
}

export class Rules {
  private rulesMap: RulesMap = {};

  constructor(rules: RulesMap) {
    this.rulesMap = rules;
  }

  validate<T extends { [name: string]: any }>(formValue: T | undefined, files?: Files): true | string {
    if(files) {
      formValue = Object.assign({}, formValue, files)
    }
    if(typeof formValue === 'undefined') {
      return 'parameter is required.'
    }
    for (const name in this.rulesMap) {
      if (this.rulesMap.hasOwnProperty(name)) {
        const rules = this.rulesMap[name];
        for (const rule of (!Array.isArray(rules) ? [rules] : rules)) {
          const { required, pattern, validator, message, type, max, min } = rule;
          const value = formValue[name];
          /** 如果值不存在或NaN */
          if(typeof value === 'undefined' || value === null || (typeof value === 'number' && isNaN(value))) {
            /** 检查是否为必填字段 */
            if(required) {
              return message || `"${name}" Cannot be null undefined or NaN`;
            } else {
              /** 如果不是必填字段并且没有值，跳过这个值的检查 */
              continue
            }

          } else {
            /** 走到这里都是有值的情况 */
            const typeofValue = typeOf(value)
            /** 类型检查 */
            if(type && typeofValue !== type.name.toLocaleLowerCase()) {
              return message || `"${name}" must Be instanceof ${type.name}`;
            }

            /** 检查正则表达式 */
            if (pattern && !pattern.test(value)) {
              return message || `Invalid parameter "${name}"`;
            }

            if(max || min) {
              const m = max ?? Infinity
              const n = min ?? -Infinity
              switch(typeofValue) {
                case 'string':
                case 'array':
                  if(value.length > m || value.length < n) {
                    return 'The input parameters are either too long or too short.'
                  }
                  break
                case 'number':
                  if(value > m || value < n) {
                    return 'The number is either too large or too small.'
                  }
                default:
                  break
              } 
            }
          }

          /** 检查自定义验证器 */
          if (validator) {
            const errorMessage = validator(value, rule);
            if (errorMessage) {
              return errorMessage;
            }
          }
          
        }
      }
    }

    return true; // 所有规则都通过验证
  }
}

export default (rules: RulesMap) => {
  const rulesInstance = new Rules(rules)
  return async (ctx: Global.KoaContext, next: Global.KoaNext) => {
    let formValue = {};
    if (ctx.method === 'GET' || ctx.method === 'DELETE') {
      formValue = ctx.request.query;
    } else {
      formValue = ctx.request.body;
    }
    const result = rulesInstance.validate(formValue, ctx.request.files);
    if (result !== true) {
      ctx.body = Result.error({code: Result.ResponseCode.INVALID_PARAMS, msg: result});
    } else {
      return next()
    }
  }
}