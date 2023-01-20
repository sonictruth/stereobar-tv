export default (url: string) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.overrideMimeType('text/plain; charset=x-user-defined');
    req.onload = function () {
      if (this.status === 200) {
        resolve(req.responseText);
      } else if (req.status === 0) {
        reject(req);
      } else {
        reject(req);
      }
    };
    req.onerror = reject;
    req.send();
  });
};
