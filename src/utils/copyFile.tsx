import RNFS from 'react-native-fs';

type interfaceCopyFile = {
  initalPath: string;
  destinationPath: string;
};
function FileCopyCustome(fn: interfaceCopyFile) {
  RNFS.copyFile(fn.initalPath, fn.destinationPath)
    .then(success => {
      console.log(success);
      console.log('file moved!' + success);
    })
    .catch(err => {
      console.log('Error: ' + err.message);
    });
}

export default FileCopyCustome;
