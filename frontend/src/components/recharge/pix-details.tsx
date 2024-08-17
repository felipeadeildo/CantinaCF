import { TPaymentRequest } from '@/types/recharge'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

import { toReal } from '@/lib/utils'
import { Clipboard, Verified } from 'lucide-react'

export const PixDetails = ({ payment }: { payment: TPaymentRequest }) => {
  const [buttonIcon, setButtonIcon] = useState<React.ReactNode>(<Clipboard />)

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(payment.transaction_data_json.qr_code)
      .then(() => {
        setButtonIcon(<Verified />)
        setTimeout(() => setButtonIcon(<Clipboard />), 1000)
      })
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div>
        <p className="text-sm text-center font-semibold">Código PIX</p>
        <Image
          src={`data:image/png;base64,${payment.transaction_data_json.qr_code_base64}`}
          alt="qr code"
          width={300}
          height={300}
          className="rounded-md"
        />
      </div>

      <h2>{toReal(payment.value)}</h2>

      <div className="flex gap-2 items-center">
        <Input
          value={payment.transaction_data_json.qr_code}
          readOnly
          disabled
        />
        <Button variant="outline" onClick={copyToClipboard} size="icon">
          {buttonIcon}
        </Button>
      </div>

      <p className="text-sm text-end">
        Escaneie o código QR ou copie a código pix para realizar o pagamento!
      </p>
    </div>
  )
}
