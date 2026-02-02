"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Glow } from "@react-three/drei";
import * as ONE from "three";
import Scene3DErrorBoundary from "./Scene3DErrorBoundary";

function AbstractShape() {
    const meshRef = useRef<ONE.Mesh>(null);
    const groupRef = useRef<ONE.Group>(null);

    useFrame((state) => {
        if (!meshRef.current || !groupRef.current) return;

        const time = state.clock.getElapsedTime();

        // Smooth, elegant rotation
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.3;
        groupRef.current.rotation.y = time * 0.25;
        groupRef.current.rotation.z = Math.cos(time * 0.25) * 0.2;

        // Scale pulsing for depth effect
        const scale = 1 + Math.sin(time * 1.5) * 0.08;
        meshRef.current.scale.set(scale, scale, scale);
    });

    return (
        <Float speed={3} rotationIntensity={0.3} floatIntensity={0.4}>
            <group ref={groupRef}>
                {/* Main glossy shape */}
                <mesh ref={meshRef} scale={2}>
                    <icosahedronGeometry args={[1, 4]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.15}
                        metalness={0.85}
                        emissive="#BBFD6A"
                        emissiveIntensity={0.4}
                        envMapIntensity={1.2}
                    />
                </mesh>

                {/* Enhanced wireframe layer */}
                <mesh scale={2.05}>
                    <icosahedronGeometry args={[1, 4]} />
                    <meshStandardMaterial
                        color="#BBFD6A"
                        wireframe={true}
                        emissive="#BBFD6A"
                        emissiveIntensity={0.6}
                        transparent
                        opacity={0.4}
                        roughness={0}
                        metalness={1}
                    />
                </mesh>

                {/* Glow sphere for depth */}
                <mesh scale={2.15}>
                    <icosahedronGeometry args={[1, 4]} />
                    <meshStandardMaterial
                        color="#BBFD6A"
                        emissive="#BBFD6A"
                        emissiveIntensity={0.15}
                        transparent
                        opacity={0.15}
                    />
                </mesh>
            </group>
        </Float>
    );
}

function Particles() {
    const count = 150;
    const mesh = useRef<ONE.InstancedMesh>(null);

    const dummy = useMemo(() => new ONE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s * 0.8, s * 0.8, s * 0.8);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial 
                color="#BBFD6A" 
                roughness={0.3} 
                metalness={0.8}
                emissive="#BBFD6A"
                emissiveIntensity={0.5}
            />
        </instancedMesh>
    );
}

export default function Scene3D() {
    return (
        <Scene3DErrorBoundary>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
                <Canvas 
                    camera={{ position: [0, 0, 12], fov: 50 }}
                    gl={{ 
                        preserveDrawingBuffer: true,
                        failIfMajorPerformanceCaveat: false,
                        powerPreference: "high-performance",
                        antialias: true,
                        alpha: true
                    }}
                    onCreated={({ gl }) => {
                        gl.setClearColor("#000000", 0);
                        gl.outputColorSpace = "srgb";
                        
                        // Handle WebGL context loss
                        const canvas = gl.domElement;
                        canvas.addEventListener('webglcontextlost', (event) => {
                            event.preventDefault();
                            console.log('WebGL context lost. Attempting to restore...');
                        }, false);
                        
                        canvas.addEventListener('webglcontextrestored', () => {
                            console.log('WebGL context restored.');
                        }, false);
                    }}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={1.2} color="#ffffff" />
                        <pointLight position={[15, 15, 15]} intensity={2} color="#BBFD6A" />
                        <pointLight position={[-15, -15, 10]} intensity={1.5} color="#ffffff" />
                        <pointLight position={[0, -10, -15]} intensity={1} color="#BBFD6A" />
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.2} fade speed={0.5} />
                        <AbstractShape />
                        <Particles />
                    </Suspense>
                </Canvas>
            </div>
        </Scene3DErrorBoundary>
    );
}
