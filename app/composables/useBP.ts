import { useMediaQuery } from "@vueuse/core"

export const useBP = () => {
  const isLt1063 = useMediaQuery('(max-width: 1062px)')
  return isLt1063
}

