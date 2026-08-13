import { useEffect, useRef, useState, useCallback } from 'react';

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const triangleShapes = [
  'polygon(50% 0%, 98% 16%, 82% 100%, 18% 88%, 0% 24%)',
  'polygon(50% 0%, 98% 16%, 82% 100%, 18% 88%, 0% 24%)',
  'polygon(50% 0%, 98% 16%, 82% 100%, 18% 88%, 0% 24%)',
  'polygon(50% 0%, 98% 16%, 82% 100%, 18% 88%, 0% 24%)',
];

const createTriangles = (count, containerWidth, containerHeight) => {
  const sizeFactors = [0.38, 0.34, 0.42, 0.3];

  return Array.from({ length: count }, (_, index) => {
    const width = Math.round(containerWidth * sizeFactors[index % sizeFactors.length]);
    const height = width;

    return {
      id: index,
      width,
      height,
      x: randomBetween(0, Math.max(1, containerWidth - width)),
      y: randomBetween(0, Math.max(1, containerHeight - height)),
      vx: randomBetween(-8, 8),
      vy: randomBetween(-6, 6),
      rotation: randomBetween(0, 360),
      angularVelocity: randomBetween(-2, 2),
      color: ['rgba(163, 190, 176, 0.96)', 'rgba(80, 122, 103, 0.92)', 'rgba(27, 46, 38, 0.88)', 'rgba(52, 84, 70, 0.74)'][index % 4],
      shape: triangleShapes[index % triangleShapes.length],
    };
  });
};

export function AuthBackground({ active, shakePulse }) {
  const containerRef = useRef(null);
  const triangleRefs = useRef([]);
  const trianglesRef = useRef([]);
  const frameRef = useRef(null);
  const motionSpeedRef = useRef(1);
  const shakeTimeoutRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const previousShakePulse = useRef(0);
  const scatterModeRef = useRef(false);
  const scatterTimerRef = useRef(null);
  const [triangles, setTriangles] = useState(() => createTriangles(4, 1200, 900));

  const handleClick = useCallback((e) => {
    if (e.target !== containerRef.current) return;

    scatterModeRef.current = true;
    const clickX = e.clientX;
    const clickY = e.clientY;

    trianglesRef.current.forEach((triangle) => {
      const centerX = triangle.x + triangle.width / 2;
      const centerY = triangle.y + triangle.height / 2;
      const dx = centerX - clickX;
      const dy = centerY - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = Math.max(200, 600 - distance * 0.3);
      const angle = Math.atan2(dy, dx);

      triangle.vx = Math.cos(angle) * force * randomBetween(0.4, 1.2);
      triangle.vy = Math.sin(angle) * force * randomBetween(0.4, 1.2);
      triangle.angularVelocity = randomBetween(-3, 3);
    });

    motionSpeedRef.current = 3.5;

    clearTimeout(scatterTimerRef.current);
    scatterTimerRef.current = setTimeout(() => {
      scatterModeRef.current = false;
      trianglesRef.current.forEach((triangle) => {
        triangle.vx *= 0.15;
        triangle.vy *= 0.15;
        triangle.angularVelocity = randomBetween(-2, 2);
      });
      motionSpeedRef.current = active ? 1.8 : 1;
    }, 2500);
  }, [active]);

  useEffect(() => {
    trianglesRef.current = triangles;
  }, [triangles]);

  useEffect(() => {
    if (shakePulse > previousShakePulse.current) {
      previousShakePulse.current = shakePulse;

      trianglesRef.current.forEach((triangle) => {
        triangle.vx = Math.max(-20, Math.min(20, triangle.vx + randomBetween(-8, 8)));
        triangle.vy = Math.max(-20, Math.min(20, triangle.vy + randomBetween(-8, 8)));
        triangle.angularVelocity = Math.max(-3, Math.min(3, triangle.angularVelocity + randomBetween(-2, 2)));
      });

      motionSpeedRef.current = 2.2;
      clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = setTimeout(() => {
        motionSpeedRef.current = active ? 1.8 : 1;
      }, 1600);
    }
  }, [shakePulse, active]);

  useEffect(() => {
    motionSpeedRef.current = active ? 1.8 : 1;
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('click', handleClick);

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };

      if (!trianglesRef.current.length) {
        const initialTriangles = createTriangles(4, rect.width, rect.height);
        trianglesRef.current = initialTriangles;
        setTriangles(initialTriangles);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const step = () => {
      const { width, height } = sizeRef.current;
      if (!width || !height) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      const speedFactor = motionSpeedRef.current;
      const isScattering = scatterModeRef.current;

      trianglesRef.current.forEach((triangle) => {
        triangle.x += triangle.vx * 0.06 * speedFactor;
        triangle.y += triangle.vy * 0.06 * speedFactor;
        triangle.rotation += triangle.angularVelocity * 0.04 * speedFactor;

        if (isScattering) {
          triangle.vx *= 0.985;
          triangle.vy *= 0.985;
          triangle.angularVelocity *= 0.99;
        } else {
          if (triangle.x < -triangle.width * 0.08) {
            triangle.x = -triangle.width * 0.08;
            triangle.vx = Math.abs(triangle.vx) * 0.5;
          } else if (triangle.x + triangle.width > width + triangle.width * 0.08) {
            triangle.x = width - triangle.width + triangle.width * 0.08;
            triangle.vx = -Math.abs(triangle.vx) * 0.5;
          }

          if (triangle.y < -triangle.height * 0.08) {
            triangle.y = -triangle.height * 0.08;
            triangle.vy = Math.abs(triangle.vy) * 0.55;
          } else if (triangle.y + triangle.height > height + triangle.height * 0.08) {
            triangle.y = height - triangle.height + triangle.height * 0.08;
            triangle.vy = -Math.abs(triangle.vy) * 0.55;
          }

          triangle.vx *= active ? 0.992 : 0.988;
          triangle.vy *= active ? 0.992 : 0.988;
          triangle.angularVelocity *= 0.995;

          if (Math.abs(triangle.vx) < 1.5) triangle.vx = triangle.vx < 0 ? -1.8 : 1.8;
          if (Math.abs(triangle.vy) < 1.2) triangle.vy = triangle.vy < 0 ? -1.5 : 1.5;
        }

        const triangleEl = triangleRefs.current[triangle.id];
        if (triangleEl) {
          triangleEl.style.transform = `translate(${Math.round(triangle.x)}px, ${Math.round(triangle.y)}px) rotate(${triangle.rotation.toFixed(2)}deg)`;
        }
      });

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(frameRef.current);
      clearTimeout(scatterTimerRef.current);
    };
  }, [active, handleClick]);

  return (
    <div className="auth-background" ref={containerRef} style={{ cursor: 'pointer' }}>
      {triangles.map((triangle) => (
        <div
          key={triangle.id}
          ref={(el) => { triangleRefs.current[triangle.id] = el; }}
          className="auth-triangle"
          style={{
            width: `${triangle.width}px`,
            height: `${triangle.height}px`,
            backgroundColor: triangle.color,
            clipPath: triangle.shape,
            transform: `translate(${triangle.x}px, ${triangle.y}px) rotate(${triangle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
