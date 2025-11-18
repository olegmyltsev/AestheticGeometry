const url = 'https://api.github.com/repos/olegmyltsev/AestheticGeometry/contents/src/Ddu?ref=dev'

export async function getFilePaths() {
  let paths = []
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Файл не найден');
      return response.text();
    })
    .then(text => {
      for (let ddu of JSON.parse(text)) {
        paths.push(ddu.download_url)
      }
      return paths
    })
    .catch(() => { return '' });
}

export async function getDDU(path) {
  return fetch(path)
    .then(response => {
      if (!response.ok) throw new Error('Файл не найден');
      return response.text();
    })
    .catch(() => {return ''});
}




