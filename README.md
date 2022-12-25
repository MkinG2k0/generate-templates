Link to  [git-hub](https://github.com/MkinG2k0/generate-templates)

## Example config

```json 
{
  "templates": {
    "comp": {
      "template": "templates/comp",
      "generate": "generated/Components"
    }
  }
}

```

## Template structure

```
~/Root Directory
│
├─ src
│   ├─ Components
│   │  └── AnyComponent
│   │      └─ AnyComponent.tsx 
│   │
│   └ index.ts
│
└── templates
    └── comp
        ├─ FileName.tsx
        └─ FileName.module.scss
    
```

## Data in FileName.tsx

```tsx
import { FC } from 'react'

import style from './FileName.module.scss'

interface FileNameProps {
}

export const FileName: FC<FileNameProps> = ({}) => {
	return <div className={style.wrap}>TemplateName</div>
}
```

After running the script, "FileName" will be replaced with what you specified in the script as an argument (
TestComponents)

## Script

```npm
npx gen-template config/generate.json comp TestComponents
```

### After script run

### Components

```tsx
import { FC } from 'react'

import style from './FileName.module.scss'

interface TestComponentsProps {
}

export const TestComponents: FC<TestComponentsProps> = ({}) => {
	return <div className={style.wrap}>TestComponents</div>
}
```

### Directory

```
~/Root Directory
│
├─ src
│   ├─ Components
│   │  ├─ AnyComponent
│   │  │   └─ AnyComponent.tsx 
│   │  └─ TestComponents
│   │     ├─ TestComponents.tsx
│   │     └─ TestComponents.module.scss
│   │
│   └ index.ts
│
└── templates
    └── comp
        ├─ FileName.tsx
        └─ FileName.module.scss
    
```

## You can generate multiple files at once

```npm
npx gen-template config/generate.json comp TestComponents AnotherComponent
```
