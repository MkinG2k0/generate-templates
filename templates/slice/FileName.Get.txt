import { useStore } from 'Redux/Store/Redux.hooks'

export const GetFileName = () => useStore((state) => state)['FileName']
