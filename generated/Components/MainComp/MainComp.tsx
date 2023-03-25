import { FC } from 'react'

import style from './MainComp.module.scss'

interface MainCompProps {}

export const MainComp: FC<MainCompProps> = ({}) => {
  return <div className={style.wrap}>MainComp</div>
}
