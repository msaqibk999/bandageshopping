import React from 'react'
import styles from '../cssModules/Loader.module.css'

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  )
}
