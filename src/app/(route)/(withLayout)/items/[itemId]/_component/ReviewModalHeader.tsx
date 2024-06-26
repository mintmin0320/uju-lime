'use client'

import { useModals } from '@/app/_hook/common/useModal'
import { cn } from '@/app/_utils/twMerge'
import Image from 'next/image'

export default function ReviewModalHeader() {
  const { close } = useModals()

  return (
    <div
      className={cn(
        'flex justify-between border-b px-[23px] py-[18px]',
        'mo:border-0 mo:px-0 mo:py-[6px]',
      )}
    >
      <div className={cn('w-[36px]', 'mo:hidden')} />
      <button
        type="button"
        aria-label="close"
        onClick={() => {
          close()
        }}
      >
        <Image
          width={24}
          height={24}
          className={cn('hidden', 'mo:block')}
          src="/image/icon/icon-close.svg"
          alt="close"
        />
      </button>
      <span
        className={cn(
          'w-full text-center text-[24px]',
          'mo:text-[16px] mo:font-[600]',
        )}
      >
        리뷰 작성
      </span>
      <button
        type="button"
        aria-label="close"
        className="mo:hidden"
        onClick={() => {
          close()
        }}
      >
        <Image
          width={36}
          height={36}
          className=""
          src="/image/icon/icon-close.svg"
          alt="close"
        />
      </button>
    </div>
  )
}
