
async function readFileForm(file) {        
        // if(!(file instanceof File)  ) return false
        if (file.name.split('.').pop().toLowerCase() !== 'ddu') {
            alert('Неизвестный тип файла.');
            return false;
        }

        try {
            const content =  new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });            
            return content; // Возвращает контент из файла
        } catch (error) {
            alert(`Ошибка чтения файла`)
            return false
        }
    }

export default readFileForm
