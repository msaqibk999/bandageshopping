import React, { Children, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styles from '../cssModules/Carousel.module.css'

export default function Carousel({children}) {
  
  const containerRef = useRef()  
  const intervalRef = useRef()
  const [current, setCurrent] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const slildes = useMemo(() => {
    if(children.length > 1){
        let items = Children.map(children, (child, index) => (
        <li key={index} className={styles.slide}>
            {child}
        </li>
        ))

        return [
            <li key={children.length + 1} className={styles.slide}>
            {children[children.length - 1]}
            </li>,
            ...items,
            <li key={children.length + 2} className={styles.slide}>
            {children[0]}
            </li>
        ]
    }

    return <li className={styles.slide}>{children[0]}</li>
  },[children])

  useLayoutEffect(() => {
    setTranslateX(containerRef.current.clientWidth * current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const actionHandler = useCallback((mode) => {
    containerRef.current.style.transitionDuration = "400ms"
    if(mode === "prev"){
        if(current <= 1){
            setTranslateX(0);
            setCurrent(children.length)
        }
        else{
            setTranslateX(containerRef.current.clientWidth * (current - 1))
            setCurrent((prev) => --prev)
        }

    } else if(mode === "next"){
        if(current >= children.length){
            setTranslateX(containerRef.current.clientWidth * (children.length + 1));
            setCurrent(1)
        }
        else{
            setTranslateX(containerRef.current.clientWidth * (current + 1))
            setCurrent((prev) => ++prev)
        }
    }
  }, [current, children])

  useEffect(() => {
    const transitionEnd = () => {
        if(current <= 1) {
            containerRef.current.style.transitionDuration = "0ms"
            setTranslateX(containerRef.current.clientWidth * current)
        }
        else if(current >= children.length){
            containerRef.current.style.transitionDuration = "0ms"
            setTranslateX(containerRef.current.clientWidth * children.length)
        }
    }
    document.addEventListener("transitionend", transitionEnd)
    
    return () => {
        document.removeEventListener("transitionend", transitionEnd)
    }
  },[current, children])

  useEffect(() => {
    if(intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
        actionHandler("next")
    }, 3000);
    return () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }
  },[actionHandler])

  const handleSlideHover = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleSlideLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      actionHandler('next');
    }, 3000);
  };

  return (
    <div className={styles.carousel}>
        <div className={styles.mainContainer}>
            <ul className={styles.container}
                ref={containerRef}
                onMouseEnter={handleSlideHover}
                onMouseLeave={handleSlideLeave}
                style={{transform: `translate3d(${-translateX}px, 0, 0)`}}>
                    {slildes}
            </ul>
        </div>
        <button onClick={() => actionHandler("prev")} className={`${styles.btn} ${styles.before}`}>〈</button>
        <button onClick={() => actionHandler("next")} className={`${styles.btn} ${styles.after}`}>〉</button>
    </div>
  )
}
