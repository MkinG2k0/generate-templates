import { FC } from 'react'

import style from './Test.module.scss'

interface TestProps {}

export const Test: FC<TestProps> = ({}) => {
  return <div className={style.wrap}>Test</div>
}
