import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"

import * as THREE from 'three'
import Lights from './Lights';
// import Loader from './Loader';
import IPhone from './Iphone';
import { Suspense } from "react";
import Loader from "./Loader";

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {
  return (
    <View
    // It utilizes the View component from @react-three/drei to define different views within the scene.

      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambient light represents overall environmental illumination that comes from all directions, simulating indirect or bounced light in a scene. It uniformly lights all objects in the scene without any specific direction.  */}
      <ambientLight intensity={0.3} />

      {/* The PerspectiveCamera is the most commonly used camera in Three.js. It mimics the way human vision works, with objects appearing smaller as they move further away from the camera. It's ideal for creating scenes with depth & perspective,such as 3D environments or architectural renderings. */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />


      {/* Three.js provides camera control libraries like OrbitControls or TrackballControls, which allow users to interactively control the camera's position and orientation using mouse or touch inputs.  */}
      <OrbitControls 
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0 ,0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      /> 
      
      <group ref={groupRef} name={`${index === 1} ? 'small' : 'large`} position={[0, 0 ,0]}>
      {/* Suspense: Used to wrap components with asynchronous data dependencies. In this code, Suspense is used to suspend the rendering of the iPhone model until it's loaded asynchronously. */}
        <Suspense fallback={<Loader/>} >
          <IPhone 
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default ModelView