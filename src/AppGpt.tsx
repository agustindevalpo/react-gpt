import { RouterProvider } from "react-router-dom"
import { router } from "./presentation/router/router"

export const AppGpt = () => {
    return (
        <RouterProvider router={ router } />
    )
  }