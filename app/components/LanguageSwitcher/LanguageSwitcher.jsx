import { images } from '@/app/utilities/assets'
import Image from 'next/image'
import React from 'react'

function LanguageSwitcher() {
  return (
    <button className='cursor-pointer'>
      <Image src={images.LANGUAGE} alt='language' width={25} height={25} />
    </button>
  )
}

export default LanguageSwitcher