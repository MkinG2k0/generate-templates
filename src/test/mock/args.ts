export const mockArgs =
  '_node _path /config/config.js template-1 --flag-template template-2 name: name-1 --flag-name name-2  name-space  ./path-to-name-1 --flag-path  ./path/to/name/2  '.split(
    ' ',
  )

export const realArgs = '_node _path /config/config.js page comp name: Main Auth '.split(' ')
export const failedArgs = '_node _path /another_path/config.js page comp name: Main Auth '.split(' ')
