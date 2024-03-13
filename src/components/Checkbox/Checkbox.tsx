import { FaCheck } from "react-icons/fa"
import styles from "./Checkbox.module.scss"

type Props = {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const Checkbox: React.FC<Props> = ({ checked = false, onChange }) => {
  return (
    <div className={styles.container} onClick={() => onChange?.(!checked)}>
      {checked && <FaCheck size={20} />}
    </div>
  )
}

export default Checkbox
