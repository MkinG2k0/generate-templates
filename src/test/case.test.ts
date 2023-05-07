import { describe, expect } from 'vitest'
import { Case } from '../modules/case-class.js'

describe('Case class', () => {
  test('Read case', () => {
    expect(Case.read('normal')).toBe('normal')
    expect(Case.read('Normal')).toBe('upperNormal')
    expect(Case.read('camelCase')).toBe('lowerCamel')
    expect(Case.read('CamelCase')).toBe('camel')
    expect(Case.read('kebab-case')).toBe('kebab')
    expect(Case.read('snake_case')).toBe('snake')
    expect(Case.read('space case')).toBe('space')
    expect(Case.read('combine-case_case')).toBe('combined')
    expect(Case.read('combine case_case')).toBe('combined')
    expect(Case.read('combine case-case')).toBe('combined')
  })

  test('Write type=type case', () => {
    expect(Case.write('normal', 'normal')).toBe('normal')
    expect(Case.write('Normal', 'upperNormal')).toBe('Normal')
    expect(Case.write('camelCase', 'lowerCamel')).toBe('camelCase')
    expect(Case.write('CamelCase', 'camel')).toBe('CamelCase')
    expect(Case.write('kebab-case', 'kebab')).toBe('kebab-case')
    expect(Case.write('snake_case', 'snake')).toBe('snake_case')
    expect(Case.write('space case', 'space')).toBe('space case')
    expect(Case.write('combine-case_case', 'combined')).toBe('combine-case_case')
    expect(Case.write('combine case_case', 'combined')).toBe('combine case_case')
    expect(Case.write('combine case-case', 'combined')).toBe('combine case-case')
  })

  test('Write to camel case', () => {
    expect(Case.write('normal', 'camel')).toBe('Normal')
    expect(Case.write('Normal', 'camel')).toBe('Normal')
    expect(Case.write('camelCase', 'camel')).toBe('CamelCase')
    expect(Case.write('CamelCase', 'camel')).toBe('CamelCase')
    expect(Case.write('kebab-case', 'camel')).toBe('KebabCase')
    expect(Case.write('snake_case', 'camel')).toBe('SnakeCase')
    expect(Case.write('space case', 'camel')).toBe('SpaceCase')
    expect(Case.write('combine-case_case', 'camel')).toBe('CombineCaseCase')
    expect(Case.write('combine case_case', 'camel')).toBe('CombineCaseCase')
    expect(Case.write('combine case-case', 'camel')).toBe('CombineCaseCase')
  })

  test('Write to kebab case', () => {
    expect(Case.write('normal', 'kebab')).toBe('normal')
    expect(Case.write('Normal', 'kebab')).toBe('normal')
    expect(Case.write('camelCase', 'kebab')).toBe('camel-case')
    expect(Case.write('CamelCase', 'kebab')).toBe('camel-case')
    expect(Case.write('kebab-case', 'kebab')).toBe('kebab-case')
    expect(Case.write('snake_case', 'kebab')).toBe('snake-case')
    expect(Case.write('space case', 'kebab')).toBe('space-case')
    expect(Case.write('combine-case_case', 'kebab')).toBe('combine-case-case')
    expect(Case.write('combine case_case', 'kebab')).toBe('combine-case-case')
    expect(Case.write('combine case-case', 'kebab')).toBe('combine-case-case')
  })
})
