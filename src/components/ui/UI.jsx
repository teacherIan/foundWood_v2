import { useThree } from '@react-three/fiber';

export default function UI() {
  const { camera } = useThree();

  const resetCamera = () => {
    camera.position.set(0, 0, 5);
    camera.rotation.set(0, 0, 0);
    camera.updateProjectionMatrix();
  };

  const randomizeCamera = () => {
    camera.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      2 + Math.random() * 8
    );
    camera.lookAt(0, 0, 0);
  };

  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'splat-screenshot.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="ui-interactive absolute top-4 left-4 right-4">
        <div className="glass-panel p-4">
          <h1 className="text-2xl font-bold text-white">Found Wood R3F Demo</h1>
          <p className="text-gray-300 mt-1">React Three Fiber + Tailwind CSS</p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="ui-interactive absolute bottom-4 left-4 right-4">
        <div className="glass-panel p-4">
          <div className="flex justify-center space-x-4">
            <button className="btn-primary" onClick={resetCamera}>
              Reset Camera
            </button>
            <button className="btn-primary" onClick={randomizeCamera}>
              Random View
            </button>
            <button className="btn-primary" onClick={takeScreenshot}>
              Screenshot
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="ui-interactive absolute top-20 right-4 w-64">
        <div className="glass-panel p-4">
          <h3 className="text-lg font-semibold mb-3">Scene Controls</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Rotation Speed
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Object Scale
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
