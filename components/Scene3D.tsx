"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Stars } from "@react-three/drei";
import * as ONE from "three";

function AbstractShape() {
    const meshRef = useRef<ONE.Mesh>(null);

    // Create a custom geometry or use a primitive
    // We'll use a Icosahedron for a tech/abstract feel

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();

        // Gentle rotation
        meshRef.current.rotation.x = time * 0.1;
        meshRef.current.rotation.y = time * 0.15;

        // Gentle float/wobble is handled by Float wrapper, but we can add more specific deformations if we used a shader
        // For now, let's keep it simple and elegant with a nice material
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={1.8}>
                <icosahedronGeometry args={[1, 1]} /> {/* Low poly look */}
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.1}
                    metalness={0.9}
                    wireframe={true}
                    emissive="#BBFD6A"
                    emissiveIntensity={0.2}
                />
            </mesh>
            <mesh scale={1.79}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#000000"
                    roughness={0.1}
                    metalness={1}
                />
            </mesh>
        </Float>
    );
}

function Particles() {
    const count = 100;
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
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#BBFD6A" roughness={0.5} metalness={0.5} />
        </instancedMesh>
    );
}

function FallingBlocks() {
    const count = 120;
    const mesh = useRef<ONE.InstancedMesh>(null);
    const dummy = useMemo(() => new ONE.Object3D(), []);
    const blocks = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                x: -8 + Math.random() * 16,
                y: -6 + Math.random() * 12,
                z: -6 + Math.random() * 12,
                speed: 0.005 + Math.random() * 0.01,
                size: 0.1 + Math.random() * 0.25,
                rot: Math.random() * Math.PI,
            });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (!mesh.current) return;
        blocks.forEach((block, i) => {
            block.y -= block.speed;
            block.rot += block.speed * 2;
            if (block.y < -7) {
                block.y = 7;
            }
            dummy.position.set(block.x, block.y, block.z);
            dummy.rotation.set(block.rot, block.rot, block.rot);
            dummy.scale.set(block.size, block.size, block.size);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#BBFD6A" roughness={0.4} metalness={0.6} />
        </instancedMesh>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#BBFD6A" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <AbstractShape />
                <Particles />
                <FallingBlocks />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
