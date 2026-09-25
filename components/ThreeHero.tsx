'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeHero() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 700px)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, mobile ? 8.4 : 7.2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    mount.appendChild(renderer.domElement)

    const root = new THREE.Group()
    scene.add(root)

    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xc7ff38 })
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x30332c, transparent: true, opacity: 0.72 })
    const nodes: THREE.Mesh[] = []
    const points: THREE.Vector3[] = []
    const count = mobile ? 12 : 20

    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2
      const radius = mobile ? 2.25 + (i % 3) * 0.28 : 2.55 + (i % 4) * 0.3
      const p = new THREE.Vector3(Math.cos(a) * radius, Math.sin(a * 1.25) * 1.55, Math.sin(a) * radius * 0.42)
      points.push(p)
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(mobile ? 0.045 : 0.055, 8, 8), nodeMaterial)
      mesh.position.copy(p)
      root.add(mesh)
      nodes.push(mesh)
    }

    const lines = new THREE.Group()
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        if (points[i].distanceTo(points[j]) < (mobile ? 2.0 : 2.15)) {
          const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[j]])
          lines.add(new THREE.Line(geometry, lineMaterial))
        }
      }
    }
    root.add(lines)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.018, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0x9ea89a, transparent: true, opacity: 0.45 })
    )
    ring.rotation.x = Math.PI / 2.4
    root.add(ring)

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 1),
      new THREE.MeshBasicMaterial({ color: 0xf4f4ee, wireframe: true, transparent: true, opacity: 0.85 })
    )
    root.add(core)

    const pointer = { x: 0, y: 0 }
    const onPointerMove = (event: PointerEvent) => {
      if (mobile) return
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.22
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.16
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const resize = () => {
      const width = mount.clientWidth || 1
      const height = mount.clientHeight || 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(mount)

    let raf = 0
    const animate = () => {
      if (!reduced) {
        root.rotation.y += mobile ? 0.0018 : 0.0025
        root.rotation.x = Math.sin(performance.now() * 0.00025) * 0.07 + pointer.y
        root.rotation.z = pointer.x
        core.rotation.x += 0.0018
        core.rotation.y += 0.0024
        ring.rotation.z += 0.0014
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      mount.removeChild(renderer.domElement)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose())
        else if (mesh.material) mesh.material.dispose()
      })
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="three-hero" />
}
