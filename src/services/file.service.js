import fs from 'fs';

export default class FileService {
    async savingFile(image, idArtist){
        const path = `C:/nginx-1.16.1/html/img/${idArtist}.jpg`;
        const data = image._data;
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, err => {
                if (err) {
                    reject(err)
                }
                resolve({message: 'success'})
            });
        });
    }
}