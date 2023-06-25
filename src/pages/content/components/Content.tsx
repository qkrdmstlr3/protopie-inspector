import { useEffect } from 'react';

export function Content() {
  useEffect(() => {
    console.log('loaded');
    chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
      if (request.action === 'ANALYZE') {
        const body = document.querySelector('body');
        if (body) {
          body.style.backgroundColor = 'red';
        }
        sendResponse({ result: 'success' });
      }
    });
  }, []);

  return <div className="content-view">content view</div>;
}
