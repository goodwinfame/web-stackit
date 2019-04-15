import React from 'react'
import styles from './comp.module.scss'


interface props {
    children: string
}
export default ({children}: props) => {
    let artical = children.split("\n");
   
    return (
        <div className={styles.Artical}>
            {
                artical.map((v, i)=>(
                    v == ""
                    ?
                    <br key={i}/>
                    :
                    <p key={i}>{v}</p>
                ))
            }
          
        </div>
       
    )
}

export const Question = ({children}: props) => {
    let artical = children.split("\n");
    let mainTitleIndex: number | undefined;

    return (
        <div className={styles.Artical}>
            {
                artical.map((v, i)=>{
                    if(v == ""){
                        return <br key={i}/>;
                    } else {
                        if(mainTitleIndex === undefined){
                            mainTitleIndex = i;
                        }

                        if(mainTitleIndex === i){
                            return <h3 key={i}>{v}</h3>
                        } 
                        
                        return <p key={i}>{v}</p>
                    }

                   
                })
            }
          
        </div>
       
    )
}

