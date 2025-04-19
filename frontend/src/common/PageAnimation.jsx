import React from 'react'
import { animate, AnimatePresence, motion } from 'framer-motion';
 

const PageAnimation = ({ className, keyValue, transition = {duration: 1},  animate = {opacity:1} , children,initial = { opacity: 0} }) => {
  return (
    <motion.div
    key={keyValue}
    initial={initial}
    animate={animate}
    transition={transition}
    className={className}
    >
        {children}
    </motion.div>
  )
}

export default PageAnimation;
