import { useCallback, useState } from "react"

/** Simplifies the code for forced refreshes.
 * The useForceUpdate from React does not work as needed. 
 * By using the useState hook and assigning objects, it guarantees the data is always new (each object has a unique reference), and that the state is updated.
 */
export const useRefresh = () => {
  const [refresh, setRefresh] = useState({})

  const updateRefresh = useCallback(() => {
    setRefresh({});
  }, [setRefresh]);

  return [refresh, updateRefresh] as [{}, () => void];
}