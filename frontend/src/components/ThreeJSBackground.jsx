import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeJSBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Only run if the ref is attached
    if (!mountRef.current) return;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    // Configure renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Append renderer to our mount point
    mountRef.current.innerHTML = ""; // Clear any existing content
    mountRef.current.appendChild(renderer.domElement);

    // Create 3D farm field elements
    const fieldGeometry = new THREE.PlaneGeometry(2000, 400, 400, 100);
    const fieldMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a7c59,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.position.y = -10;
    scene.add(field);

    // Create 3D plant models
    function createPlant(x, z) {
      const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
      const stemMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);

      const leafGeometry = new THREE.SphereGeometry(1, 8, 8);
      leafGeometry.scale(1, 0.5, 1);
      const leafMaterial = new THREE.MeshBasicMaterial({ color: 0x8cc084 });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.y = 1.5;

      const plant = new THREE.Group();
      plant.add(stem);
      plant.add(leaf);
      plant.position.set(x, 0, z);
      return plant;
    }

    // Add plants in a grid pattern
    for (let x = -150; x <= 400; x += 10) {
      for (let z = -50; z <= 40; z += 10) {
        const plant = createPlant(x, z);
        scene.add(plant);
      }
    }

    // Create animated floating QR code cubes
    function createQRCube(x, y, z) {
      const geometry = new THREE.BoxGeometry(3, 3, 3);
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x8cc084 })
      );

      line.position.set(x, y, z);
      line.userData = {
        speedY: Math.random() * 0.02 + 0.01,
        rotationSpeed: Math.random() * 0.01 + 0.005,
      };
      return line;
    }

    const qrCubes = [];
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 80 - 40;
      const y = Math.random() * 15 + 5;
      const z = Math.random() * 80 - 40;
      const cube = createQRCube(x, y, z);
      scene.add(cube);
      qrCubes.push(cube);
    }

    // Position camera
    camera.position.set(0, 15, 50);
    camera.lookAt(0, 0, 0);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Animate QR cubes
      qrCubes.forEach((cube) => {
        cube.rotation.x += cube.userData.rotationSpeed;
        cube.rotation.y += cube.userData.rotationSpeed;

        cube.position.y += cube.userData.speedY;
        if (cube.position.y > 20) {
          cube.position.y = 0;
        }
      });

      // Gentle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0002) * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "98.9vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
};

export default ThreeJSBackground;
