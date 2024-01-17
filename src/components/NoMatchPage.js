import React from 'react'
import styles from '../cssModules/LandingPage.module.css'

export default function NoMatchPage() {
  return (
    <div className={styles.noMatchContainer}>
        <h1>No page found for this route</h1>
        <img className={styles.notFoundImg} src='https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png' alt=''/>
    </div>
  )
}
