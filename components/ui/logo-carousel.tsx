'use client'

import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"

// Logo images from Cloudinary
const logos = [
  {
    src: "https://res.cloudinary.com/dp3gvxyft/image/upload/v1763762544/1_p3xabz.png",
    alt: "Partner Logo 1"
  },
  {
    src: "https://res.cloudinary.com/dp3gvxyft/image/upload/v1763762544/2_f9va8i.png", 
    alt: "Partner Logo 2"
  },
  {
    src: "https://res.cloudinary.com/dp3gvxyft/image/upload/v1763762544/4_og0guo.png",
    alt: "Partner Logo 3"
  },
  {
    src: "https://res.cloudinary.com/dp3gvxyft/image/upload/v1763762544/3_bujyy8.png",
    alt: "Partner Logo 4"
  },
]

export function LogoCarousel() {
  return (
    <section className="py-6 bg-gray-50/30 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            Seguridad y Certificaciones
          </p>
        </div>
        
        <Marquee
          className="h-20 md:h-24 overflow-visible"
          pauseOnHover={true}
          speed={30}
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center mx-6 md:mx-10 min-w-[140px] md:min-w-[200px] h-20 md:h-24 opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={140}
                className="h-[60px] md:h-[80px] w-auto object-contain max-w-[140px] md:max-w-[200px] scale-[1.1] md:scale-[1.3]"
                priority={index < 2}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}