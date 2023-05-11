import React , {useRef,useState} from 'react'
import styles from '@/styles/bar.module.css'
import Image from 'next/image'
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { formatDate } from '@/utils/formatDate';
const Bar = (props:{
    id:string,
    date:string,
    name:string,
    price:string,
    status:string,
    color:string,
    colorStatus:string,
    onClick: () => void
}) => {

    const {view,setView,invoice, isLight } = useInvoice();  // use the hook
    const [isHover, setIsHover] = useState(false);

    const barStyle = isHover ? { border: '1px solid #7C5DFA' } : {};

    return (
        <>
            <div style={barStyle} className={`${styles.Bar} ${isLight?styles.light:styles.dark}`}  onClick={()=>{
                    props.onClick()
                    setView(false)
            }}
            onMouseEnter={()=>{
                setIsHover(true)
            }} 
            onMouseLeave={()=>{
                setIsHover(false)
            }}
            >
                <div className={styles.BarHashtag}>
                    <span className={styles.BarSpan}>#</span>
                    <p className={`${styles.BarCode} ${isLight?styles.light:styles.dark}`}>
                        {props.id}
                    </p>
                </div>
                <p className={`${styles.BarDate} ${isLight?styles.light:styles.dark}`}>
                    {formatDate(props.date)}
                </p>
                <p className={`${styles.BarName} ${isLight?styles.light:styles.dark}`}>
                    {props.name}
                </p>
                <div className={`${styles.BarPrice} ${isLight?styles.light:styles.dark}`}>
                    <span className={`${isLight?styles.light:styles.dark}`}>
                        $
                    </span>
                    {props.price}
                </div>
                <div className={styles.BarStatus}>
                    <div className={styles.StatusDiv}
                    style={{ background: props.colorStatus }}
                    >
                        <div className={styles.StatusRound} 
                        style={{ background: props.color }}
                        ></div>
                        <p className={styles.StatusText}>{props.status}</p>
                    </div>
                    <Image className={styles.StatusArrow} src={'/image/icon-arrow-right.svg'} alt='icon-arrow-right' width={8} height={8} />
                </div>
            </div>
        </>
    )
}

export default Bar