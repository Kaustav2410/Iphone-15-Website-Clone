import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../ulits";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

// video and indicator
//stores all the data about the state of the entire video player 
// isEnd:indicates whether the current video that has been played ended or not 
//startPlay:indicates whether the entrie sequence of playing multiple videos has started or not ??     
// videoId stores the id of the current video that is been played 
// isLastVideo:indicates whether the current video that has been played is the last one in the sequence or not 
// isPlaying:indicates whether the current video is playing or is been paused or not (by toggling we can pause the video)
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

//   stores the highlightsSlides data to check whether the data that we have imported is empty or not 
  const [loadedData, setLoadedData] = useState([]);
//   Destructuring the data from the video object so that we don't have to reference it later on like video.isEnd or video.isPlaying
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

// Like useEffect based on the dependency it will animated the element with the given id or className
  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    // Inside of the map each of the element is wrapped inside of the div whose id is slider based on their id move them towards the left so that the next wrapper can come 
    // videoId used to calcuate the distance they have to move to come in the viewport
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
    });

    // video animation to play the video when it is in the view
    // once the video tag comes in the viewport only then the video will start to play
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
    //   restart: When the animation triggers, it restarts from the beginning.
    // none none none: It doesn't do anything when the animation completes, reverses, or toggles off.
    //   This is a callback function that runs when the animation completes.
    // It updates the state of the video object using the setVideo function. It sets startPlay and isPlaying to true, indicating that the video has started playing.
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
    // This ensures that the animation plays when the relevant video enters the viewport or when the carousel progresses to the next video.
  }, [isEnd, videoId]);

  useEffect(() => {
    // currentProgress of the video with the videoId stored in video state (video length) inital value is 0
    let currentProgress = 0;
    //   the ref attribute is a function that receives the DOM element(el) as its argument and stores it in the videoRef.current array at index i
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animation to move the indicator
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // get the progress of the video
          //   Gets the progress of the animation.
          // anim.progress(); // returns the progress like 0.5
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // set the width of the progress bar
            // inital width of the total progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                  ? "10vw" // tablet
                  : "4vw", // laptop
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // when the video is ended, replace the progress bar with the indicator and change the background color
        // back to circle
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

    //   videoId is zero then start from the beginning
      if (videoId == 0) {
        anim.restart();
      }

      // update the progress bar based on the currentTime and the total duration of the video
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate);
      }
    //If isPlaying is true, indicating that the video is currently playing, it adds animUpdate as a callback function to the GSAP ticker. This function updates the progress bar based on the video's current playback progress.
    // If isPlaying is false, indicating that the video is paused, it removes animUpdate from the GSAP ticker. This effectively stops the progress bar from updating while the video is paused, conserving resources and preventing unnecessary updates.
    // can add or remove callback functions to the ticker. These callbacks are executed on each frame, allowing for custom animations, updates, or other actions to occur synchronously with the animation loop.
    // ticker ensures that the animations run smoothly by executing code at a consistent frame rate, usually matching the browser's refresh rate.
    }
  }, [videoId, startPlay]);

//   Check whether the data is been loaded or not if it is then only start playing the video or not
  useEffect(() => {
    if (loadedData.length > 3) {
        // if video is not playing it means it could be paused so pause the animation too (progress bar)
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
    
  }, [startPlay, videoId, isPlaying, loadedData]);

  // vd id is the id for every video until id becomes number 3
//   Based on different command perform different actions 
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };
//   when the metaData of the video loads it will trigger handleLoadedMetaDat so that add the data into LoadedData
  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload="auto"
                  muted
                //   the ref attribute is a function that receives the DOM element(el) as its argument and stores it in the  videoRef.current array at index i
                  ref={(el) => (videoRef.current[i] = el)}
                //   once current video finished playing based on the videoId of the current video perform different actions
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                //   when the video starts playing mark the isPlaying true (current video is playing)
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                //   when the metaData loads  we can add it to our loaded data array and start playing the video
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
            {/* based on the highlightsSlides length span tags are returned videoDivRef shows the entire length of the video*/}
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
                {/* spanRef is used to show the currentprogess compared to the entire length */}
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
            {/* Show different buttons based on the values stored in the video state */}
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
                // different actions are performed based on the video state
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;