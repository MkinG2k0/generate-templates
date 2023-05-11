import { FC } from 'react'

import style from './FileName.module.scss'

import file from 'generated/Pages/'

interface FileNameProps {}


export const FileName : FC<FileNameProps>
 = ({}) => {
  return <div className={style.wrap}
>{'NewName'}</div>
}

FileName.defaultProps = {}

