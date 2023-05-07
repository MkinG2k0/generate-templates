import { regExp } from '../constant/reg-exp.js'

export type TCheckCase = 'camel' | 'lowerCamel' | 'snake' | 'space' | 'normal' | 'kebab'

export type TCase = TCheckCase | 'combined' | 'upperNormal' | 'unknown'

export class Case {
  static write(data: string, typeCase: TCase) {
    const dataKebab = Case.toKebab(data)

    switch (typeCase) {
      case 'upperNormal':
        return Case.upperFirstChar(dataKebab.split('-').join(''))
      case 'camel':
        return dataKebab.split('-').map(Case.upperFirstChar).join('')
      case 'lowerCamel':
        return dataKebab
          .split('-')
          .map((value, index) => (index === 0 ? value.toLowerCase() : Case.upperFirstChar(value)))
          .join('')
      case 'snake':
        return dataKebab.replaceAll('-', '_')
      case 'space':
        return dataKebab.replaceAll('-', ' ')
      case 'normal':
        return dataKebab.split('-').join('')
      case 'kebab':
        return dataKebab
      default:
        return data
    }
  }

  static toKebab(data: string) {
    const type = Case.read(data)

    switch (type) {
      case 'upperNormal':
        return data.toLowerCase()
      case 'camel':
        return Case.saveSplit(data, regExp.upper).map(Case.toLower).join('-')
      case 'lowerCamel':
        return Case.saveSplit(data, regExp.upper).map(Case.toLower).join('-')
      case 'snake':
        return data.split('_').map(Case.toLower).join('-')
      case 'space':
        return data.split(' ').map(Case.toLower).join('-')
      case 'combined':
        return data.split(regExp.any).map(Case.toLower).join('-')
      case 'kebab':
        return data.toLowerCase()
      default:
        return data
    }
  }

  static toLower(value: string) {
    return value.toLowerCase()
  }

  static saveSplit(data: string, key: string | RegExp) {
    const result: string[] = []

    data.split('').map((value) => {
      if (value.match(key)) {
        result.push(value)
      } else {
        const newVal = (result.at(-1) || '').concat(value)
        if (result.length === 0) {
          result.push(newVal)
        } else {
          result[result.length - 1] = newVal
        }
      }
    })

    return result
  }

  static toCamel(data: string) {
    const type = Case.read(data)

    switch (type) {
      case 'kebab':
        return data.split('-').map(Case.upperFirstChar).join('')
      case 'snake':
        return data.split('_').map(Case.upperFirstChar).join('')
      case 'lowerCamel':
        return data[0].toLowerCase().concat(data.slice(1))
      case 'space':
        return data.split(/ /).map(Case.upperFirstChar).join('')
      case 'combined':
        return data
          .split(/. |.-|._/)
          .map(Case.upperFirstChar)
          .join('')
      default:
        return data
    }
  }

  static upperFirstChar(data: string) {
    return data ? data[0].toUpperCase().concat(data.toLowerCase().slice(1)) : data
  }

  static read(data: string): TCase {
    const isSpace = data.match(/ /)
    const isSnake = data.match(/_/)
    const isKebab = data.match(/-/)
    const isUpperData = data.slice(1).match(regExp.upper)
    const isCamel = data[0].match(regExp.upper) && isUpperData
    const isLowerCamel = data[0].match(regExp.lower) && isUpperData
    const isUpperNormal = data[0].match(regExp.upper)
    const isNormal = data.match(regExp.lower)

    const isCombined = [isSnake, isKebab, isLowerCamel].find((value) => Boolean(value))

    if (isSpace && !isCombined) return 'space'
    else if (isKebab && !isSnake && !isSpace && !isSnake) return 'kebab'
    else if (isSnake && !isCamel && !isSpace && !isKebab) return 'snake'
    else if (isCamel && !isSnake && !isSpace && !isKebab) return 'camel'
    else if (isLowerCamel) return 'lowerCamel'
    else if (isCombined) return 'combined'
    else if (isUpperNormal) return 'upperNormal'
    else if (isNormal) return 'normal'
    else return 'unknown'
  }
}
