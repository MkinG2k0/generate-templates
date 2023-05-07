### extra-reducers

> asdasd

```ts
import { setStatus } from '@ReduxHelper'
import { PayloadAction } from '@reduxjs/toolkit'

import { FileNameModel } from './FileName.Model'
import { fetchFileName } from './FileName.Thunk'

export const extraReducers = {
  [fetchFileName.pending.type]: (state: FileNameModel, action) => setStatus(state.data, action, 'pending'),
  [fetchFileName.rejected.type]: (state: FileNameModel, action) => setStatus(state.data, action, 'rejected'),
  [fetchFileName.fulfilled.type]: (state: FileNameModel, action: PayloadAction<string>) => {
    setStatus(state.data, action, 'fulfilled')
    state.data.data = action.payload
  },
}
```

### get

```ts
import { useStore } from 'Redux/Store/Redux.hooks'

export const GetFileName = () => useStore((state) => state)['FileName']
```

### init

```ts
import { FileNameModel } from './FileName.Model'

export const initialState: FileNameModel = {
  data: {
    status: 'idle',
  },
}
```

### type

```ts
export interface FileNameModel {
  data: IStatus<any>
}
```

### reducers

```ts
import { PayloadAction } from '@reduxjs/toolkit'

import { FileNameModel } from 'templates/slice/FileName.Model.txt'

export const reducers = {
  setFileName(state: FileNameModel, action: PayloadAction<string>) {
    state.data.data = action.payload
  },
}
```

### slice

```ts
import { createSlice } from '@reduxjs/toolkit'

import { extraReducers } from 'templates/slice/FileName.ExReducers.txt'
import { initialState } from 'templates/slice/FileName.Init.txt'
import { reducers } from 'templates/slice/FileName.Reducers.txt'

const slice = createSlice({
  name: 'FileName',
  initialState,
  reducers,
  extraReducers,
})

export const { setFileName } = slice.actions

export const FileName = slice.reducer
```

### thunk

```ts
import { Error } from '@ReduxHelper'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchFileName = createAsyncThunk<string, void, { rejectValue: string }>(
  'fetch/example',
  async function (_, { rejectWithValue }) {
    const data = 'fetch_return'
    Error(data, rejectWithValue)

    return data
  },
)
```
