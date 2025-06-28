let timerId = null;

self.onmessage = function (e) {
  const { command } = e.data;

  if (command === 'start') {
    if (timerId) clearInterval(timerId); // Clear any existing timer

    timerId = setInterval(() => {
      self.postMessage({ type: 'tick' });
    }, 1000);
  } else if (command === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};
