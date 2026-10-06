import { useState, useImperativeHandle } from 'react';

const Togglable = ({ ref, children, buttonText = 'open' }) => {
  const [open, setOpen] = useState(true);
  const openToggle = () => setOpen(!open);

  useImperativeHandle(ref, () => {
    return { openToggle };
  });

  return (
    <>
      {open && children}
      <button onClick={openToggle}>{!open ? buttonText : 'close'}</button>
    </>
  );
};
export default Togglable;
