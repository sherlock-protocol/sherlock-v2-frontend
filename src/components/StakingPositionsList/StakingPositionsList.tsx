import { useQuery } from "@apollo/client"
import { loader } from "graphql.macro"
import React from "react"
import { useAccount } from "wagmi"
import styles from "./StakingPositionsList.module.scss"
import { GetPositionsQuery } from "../../graphql/types"
import StakingPosition from "../StakingPosition/StakingPosition"
import { BigNumber } from "ethers"

const GET_POSITIONS = loader("../../graphql/queries/GetPositions.graphql")

export const StakingPositionsList: React.FC = () => {
  const [{ data: accountData }] = useAccount()
  const { loading, error, data } = useQuery<GetPositionsQuery>(GET_POSITIONS, {
    variables: {
      owner: accountData?.address,
    },
  })

  return (
    <div className={styles.container}>
      {data?.positions?.map((position) => (
        <StakingPosition
          key={position?.id?.toString()}
          id={BigNumber.from(position?.id)}
          usdcBalance={BigNumber.from(position?.usdcAmount)}
          sherRewards={BigNumber.from(position?.sherAmount)}
          lockupEnd={BigNumber.from(position?.expiration)}
        />
      ))}
    </div>
  )
}
