import { FC } from 'react'

import style from './Main.module.scss'

interface MainProps {}

export const Main: FC<MainProps> = ({}) => {
	return <div className={style.wrap}>Main</div>
}
