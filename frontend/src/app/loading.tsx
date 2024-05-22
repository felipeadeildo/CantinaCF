import { Loader } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex justify-center items-center mt-48 gap-2">
      <Loader className="animate-spin" size={32} />
      Carregando a página...
    </div>
  )
}

export default Loading
