function init_qr(resultHandler) {
  'use strict';
  var qr = new QCodeDecoder();
  if (!(qr.isCanvasSupported() && qr.hasGetUserMedia())) {
    alert('Your browser doesn\'t match the required specs.');
    throw new Error('Canvas and getUserMedia are required');
  }
  var video = document.querySelector('video');
  qr.decodeFromCamera(video, resultHandler);
}
