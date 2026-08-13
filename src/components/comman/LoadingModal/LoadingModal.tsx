import {Dialog} from '@rneui/themed';
import {useState} from 'react';
// const
const LoadingModal = () => {
  const [visible, setVisible] = useState(true);
  const toggleDialog = () => {
    setVisible(!visible);
  };
  return (
    <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
      <Dialog.Loading />
    </Dialog>
  );
};
export default LoadingModal;
