import React from 'react'
import styles from './comp.module.scss';

interface props {
    global?:boolean;
    status?: boolean;
}
export default ({status = true, global = false}: props) => {
   
    return status?<div className={`${styles.Loading} ${global?styles.global:null}`}>Loading...</div>:null
}
