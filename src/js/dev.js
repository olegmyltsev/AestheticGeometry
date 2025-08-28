input = document.getElementById('file1')

readF = () => {
    let file = new File([Text], '../Peacock.ddu')

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        console.log(reader.result);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}