// fetch('https://raw.githubusercontent.com/olegmyltsev/AestheticGeometry/refs/heads/dev/src/Ddu/.ddu')
//       .then(response => {
//         if (!response.ok) throw new Error('Файл не найден');
//         return response.text();
//       })
//       .then(text => console.log(text))
//       .catch(error => console.error('Ошибка:', error));

import { useEffect, useState } from 'react'

export default async function getFilePaths() {
  let paths = []
  return fetch('https://api.github.com/repos/olegmyltsev/AestheticGeometry/contents/src/Ddu?ref=dev')
    .then(response => {
      if (!response.ok) throw new Error('Файл не найден');
      return response.text();
    })
    .then(text => {
      for (let ddu of JSON.parse(text)) {
        paths.push(ddu.download_url)
      }
      return paths
    }).catch(() => { return 'casC' });
}
// export default async function useDduGet() {
//   const [paths, setPaths] = useState([])
//   await getFilePaths().then(content => setPaths(content))  
//   return paths
// }





