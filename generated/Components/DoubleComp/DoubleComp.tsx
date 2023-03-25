import { FC } from 'react'

import style from './DoubleComp.module.scss'

interface DoubleCompProps {}

export const DoubleComp: FC<DoubleCompProps> = ({}) => {
  return <div className={style.wrap}>DoubleComp</div>
}
