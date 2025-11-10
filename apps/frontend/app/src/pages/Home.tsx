import { useEffect } from "react"
import Rooms from "../components/Rooms"
import { useUserStore } from "../store/UserStore"

const Home = () => {
  const {user, token} = useUserStore()

  useEffect(() => {
    console.log(user, token);
    
  })
  return (
    <div>
      <Rooms/>
    </div>
  )
}

export default Home
