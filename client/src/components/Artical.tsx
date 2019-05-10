import React from 'react'
import styles from './comp.module.scss'


interface props {
    children: string
}
export default ({children}: props) => {
   
    return (
        <div className={styles.Artical} dangerouslySetInnerHTML={{__html: children}} />
    )
}

