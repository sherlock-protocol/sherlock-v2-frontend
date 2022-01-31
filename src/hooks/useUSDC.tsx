import useERC20 from "./useERC20"

/**
 * USDC contract address
 */
const USDC_ADDRESS = `${process.env.REACT_APP_USDC_ADDRESS}`

/**
 * Hook for interacting with the USDC token contract
 */
const useUSDC = () => useERC20(USDC_ADDRESS)

export default useUSDC
