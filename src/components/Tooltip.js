import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

const Tooltip = ({ content, children }) => {
  return (
    <Tippy content={content} theme="light" arrow={false}>
      {children}
    </Tippy>
  );
};

export default Tooltip;
