### FIle

```tsx
/// ${with-type}[1]
/// ${with-style}[1]
import file from '/*${path_to_generate}*/'
import folder from '/*${path_to_folder}*/'

/// ${with-type}[2]

export const FileName /* ${with-type}[3] */ = ({}) => {
  return <div /* ${with-style}[2] */>{'/*${name}*/'}</div>
}

/// ${default-props}
```

### ${with-type}[1]

```text
import { FC } from 'react'
```

### ${with-type}[2]

```text
interface FileNameProps {}
```

### ${with-type}[3]

```text
: FC<FileNameProps>
```

### ${with-style}[1]

```text
import style from './FileName.module.scss'
```

### ${with-style}[2]

```text
className={style.wrap}
```

### ${default-props}

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
