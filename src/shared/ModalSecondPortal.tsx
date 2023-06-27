import { createPortal } from 'react-dom';

type ModalPortalProps = {
  children: React.ReactNode;
};

const ModalSecondPortal = ({
  children,
}: ModalPortalProps): React.ReactPortal | null => {
  const modalRoot = document.getElementById('modal-secondRoot');

  if (!modalRoot) {
    return null;
  }

  return createPortal(children, modalRoot);
};

export default ModalSecondPortal;
