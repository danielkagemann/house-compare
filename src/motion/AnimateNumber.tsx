import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef } from "react"

interface Props {
   amount: number,
   duration?: number
}

export default function AnimateNumber({ amount, duration = 5 }: Props) {
   const count = useMotionValue(0)
   const rounded = useTransform(() => Math.round(count.get()))
   const ref = useRef(null);
   const inView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

   useEffect(() => {
      if (inView) {
         const controls = animate(count, amount, { duration })
         return () => controls.stop()
      }
   }, [amount, inView])

   return <motion.span ref={ref}>{rounded}</motion.span>
}