### FIle

```tsx
/// $type$[1]
/// $style$[1]
import file from '$pathToGenerate$'

/// $type$[2]

export const $nameCamel$ /* $type$[3] */ = ({}) => {
  return <div /* $style$[2] */>$nameUpCamel$</div>
}

/// $default-props$
```

### $type$[1]

```text
import { FC } from 'react'
```

### $type$[2]

```text
interface $nameUpCamel$Props {}
```

### $type$[3]

```text
: FC<$nameUpCamel$Props>
```

### $style$[1]

```text
import style from './FileName.module.scss'
```

### $style$[2]

```text
className={style.wrap}
```

### $default-props$

```tsx
FileName.defaultProps = {}
```

### after

```bash
npm run lint:fix
```

### before

```bash
npm run lint:fix
```

### конфиг

```json
{
  "config": {}
}
```
