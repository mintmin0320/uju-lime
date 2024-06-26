import { ItemState } from '@/app/_types/addItem.type'
import renderToast from '@/app/_utils/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { itemKeys } from '..'
import { useHandleApiError } from '../../../common/useHandleApiError'

async function postAddItem(params: ItemState) {
  const accessToken = getCookie('accessToken')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/enroll`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    },
  )

  if (!res.ok) {
    const data = await res.json()

    throw data
  }

  return res.status
}

export default function useAddItem() {
  const queryClient = useQueryClient()
  const handleApiError = useHandleApiError()

  return useMutation<number, Error, ItemState>({
    mutationFn: postAddItem,
    onSuccess: () => {
      renderToast({
        type: 'success',
        message: '아이템 등록 성공!',
      })

      queryClient.invalidateQueries({ queryKey: itemKeys.itemList._def })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}
