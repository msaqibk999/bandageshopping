// Loader.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../cssModules/Loader.module.css';

export default function Loader({ containerHeight, loaderSize, borderSize }) {
  const loaderStyle = {
    border: `${borderSize} solid #f3f3f3`,
    borderTop: `${borderSize} solid #3498db`,
    width: loaderSize,
    height: loaderSize,
  };

  const containerStyle = {
    height: containerHeight,
  };

  return (
    <div className={styles.loaderContainer} style={containerStyle}>
      <div className={styles.loader} style={loaderStyle}></div>
    </div>
  );
}

Loader.propTypes = {
  containerHeight: PropTypes.string,
  loaderSize: PropTypes.string,
  borderSize: PropTypes.string,
};

Loader.defaultProps = {
  containerHeight: '35vw',
  loaderSize: '1rem',
  borderSize: '0.2rem',
};
