import { FC } from 'react'

import style from './Auth.module.scss'

interface AuthProps {}

export const Auth: FC<AuthProps> = ({}) => {
	return <div className={style.wrap}>Auth</div>
}
