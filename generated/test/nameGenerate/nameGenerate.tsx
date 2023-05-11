import { FC } from 'react'

import style from './FileName.module.scss'

import file from 'generated/test/'

interface FileNameProps {}


export const FileName : FC<FileNameProps>
 = ({}) => {
  return <div className={style.wrap}
>{'nameGenerate'}</div>
}

FileName.defaultProps = {}

