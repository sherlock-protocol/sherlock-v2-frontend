import { ComponentStyleConfig, SystemStyleObject } from "@chakra-ui/react"

const numericStyles: SystemStyleObject = {
  "&[data-is-numeric=true]": {
    textAlign: "end",
  },
}

export const Table: ComponentStyleConfig = {
  variants: {
    dashboard: {
      table: {
        borderCollapse: "collapse",
      },
      th: {
        ...numericStyles,
      },
      td: {
        ...numericStyles,
      },
      tbody: {
        tr: {
          bg: "brand.bg",
          borderBottom: "8px solid",
          borderColor: "bg",
          "&:last-of-type": {
            borderBottom: 0,
          },
        },
      },
    },
  },
}
