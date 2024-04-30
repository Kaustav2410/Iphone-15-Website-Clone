import React, { useRef } from 'react'
import { chipImg, frameImg, frameVideo } from '../ulits'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import { animateWithGsap } from '../ulits/animation';
import { addImg } from '../ulits';
const HowItWorks = () => {
  // Ref so that we can control the video later on
  const videoRef = useRef();

  useGSAP(() => {
    gsap.from('#chip', {
      scrollTrigger: {
        trigger: '#chip',
        start: '20% bottom'
      },
      opacity: 0,
      scale: 2,
      duration: 2,
      ease: 'power2.inOut'
    })

    animateWithGsap('.g_fadeIn', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.inOut'
    })
    gsap.to('#explore',{
      scrollTrigger:{
        trigger:'#howit',
        start: '10% 50%',
        end:'90% 90%',
        toggleActions:'play reverse play reverse',
        // markers:true
      },
      opacity:1,
      

    })
  }, []);

  return (
    <section className="common-padding" id='howit'>
     <div className='h-[4rem] w-[17rem] fixed bottom-8 rounded-full backdrop-blur-sm mx-auto bg-whitish z-50 opacity-0 flex justify-center items-center gap-4 font-bold leading-9 left-1/2 transform -translate-x-1/2' id='explore'>
    <p>Go deeper with A17 pro</p>
    <div className='bg-blue rounded-full h-[2.5rem] w-[2.5rem] flex justify-center items-center' style={{ lineHeight: 0 }}>
        <p className='text-3xl text-white' style={{ marginTop: '-2px' }}>+</p>
    </div>
</div>

      <div className="screen-max-width">
        <div id="chip" className="flex-center w-full my-20">
          <img src={chipImg} alt="chip" width={180} height={180} />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="hiw-title">
            A17 Pro chip.
            <br /> A monster win for gaming.
          </h2>

          <p className="hiw-subtitle">
            It's here. The biggest redesign in the history of Apple GPUs.
          </p>
        </div>

        <div className="mt-10 md:mt-20 mb-14">
          <div className="relative h-full flex-center">
            <div className="overflow-hidden">
              <img 
                src={frameImg}
                alt="frame"
                className="bg-transparent relative z-10"
              />
            </div>
            <div className="hiw-video">
                <video className="pointer-events-none" playsInline preload="none" muted autoPlay ref={videoRef}>
                  <source src={frameVideo} type="video/mp4" />
                </video>
              </div>
          </div>
          <p className="text-gray font-semibold text-center mt-3">Honkai: Star Rail</p>
          </div>

          <div className="hiw-text-container">
                <div className="flex flex-1 justify-center flex-col">
                  <p className="hiw-text g_fadeIn">
                    A17 Pro is an entirely new class of iPhone chip that delivers our {' '}
                    <span className="text-white">
                      best graphic performance by far
                    </span>.
                  </p>

                  <p className="hiw-text g_fadeIn">
                   Mobile {' '}
                    <span className="text-white">
                      games will look and feel so immersive
                    </span>,
                     with incredibly detailed environments and characters.
                  </p>
                </div>
              

              <div className="flex-1 flex justify-center flex-col g_fadeIn">
                <p className="hiw-text">New</p>
                <p className="hiw-bigtext">Pro-class GPU</p>
                <p className="hiw-text">with 6 cores</p>
              </div>
              </div>
            </div>
    </section>
  )
}

export default HowItWorks