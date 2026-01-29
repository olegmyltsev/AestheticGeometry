const url = 'https://api.github.com/repos/olegmyltsev/AestheticGeometry/contents/src/Ddu?ref=dev'



export async function getDDU(path) {
  return fetch(path)
    .then(response => {
      if (!response.ok) throw new Error('Файл не найден');
      return response.text();
    })
    .catch(() => { return '' });
}




