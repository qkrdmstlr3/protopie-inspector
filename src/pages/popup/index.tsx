import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { Popup } from './Popup';

refreshOnUpdate('pages/popup');

(function () {
  const appContainer = document.getElementById('app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const root = createRoot(appContainer);
  root.render(<Popup />);
})();
