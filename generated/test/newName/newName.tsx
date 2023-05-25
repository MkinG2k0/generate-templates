import { FC } from 'react'

import style from './FileName.module.scss'

import file from 'generated/test/'

interface NewNameProps {}


export const newName : FC<NewNameProps>
 = ({}) => {
  return <div className={style.wrap}
>NewName</div>
}


