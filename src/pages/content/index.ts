/** Utils */
function isNotUndefined<T>(a: any): a is T {
  return a != null;
}

// async function delay(time: number) {
//   return new Promise((res) =>
//     setTimeout(() => {
//       res(true);
//     }, time)
//   );
// }

function divideElementByClassName(array: Element[]) {
  return array.reduce(
    (acc, cur) => {
      if (cur.classList.contains('section-divider')) {
        acc.push([]);
      } else {
        acc[acc.length - 1].push(cur);
      }
      return acc;
    },
    [[]] as Element[][]
  );
}

/** Functions */
function getShadowRoots(element: Element | Document | ShadowRoot = window.document) {
  return [...element.querySelectorAll('div')].filter(e => e.shadowRoot != null).map(e => e.shadowRoot);
}

function getAttrPanelData() {
  const [, attrPanel] = getShadowRoots();
  if (!attrPanel) {
    return undefined;
  }
  const [pieceWrap] = getShadowRoots(attrPanel);
  if (!pieceWrap) {
    return undefined;
  }
  const propsWrap = pieceWrap.querySelector('.props-wrap');
  if (!propsWrap) {
    return undefined;
  }
  const propList = divideElementByClassName([...propsWrap.children]);
  return propList;
}

function clickRow(shadowRoot: ShadowRoot) {
  const piece = shadowRoot.querySelector(`.piece-wrap`);
  if (isNotUndefined<HTMLDivElement>(piece)) {
    piece.click();
  }
}

function analyzeProperty(propertyList: Element[] | undefined) {
  if (propertyList == null) {
    return undefined;
  }
  const result: any = {};
  propertyList.forEach(property => {
    if (property.classList.contains('section-name')) {
      result.attribute = property.innerHTML;
      return;
    }
    if (property.classList.contains('prop')) {
      if (property.classList.contains('dynamic-prop')) {
        const attributesList = property.querySelectorAll('tr');
        [...attributesList].forEach(attributes => {
          const [keyElement, , valueElement] = attributes.querySelectorAll('td');
          if (!keyElement || !valueElement) {
            return;
          }
          const key = keyElement.innerText;
          const value = valueElement.innerText;
          result[key] = value;
        });

        return;
      }

      // else
      const key = (property.querySelector('.prop-name') as HTMLDivElement).innerText;
      const value = (property.querySelector('.prop-value') as HTMLDivElement).innerText;
      result[key] = value.replaceAll('\n', '');
      return;
    }
  });
  return result;
}

function analyzeRows(shadowRoot: ShadowRoot) {
  const properties: any[] = [];
  const header = shadowRoot.querySelector('.piece-row');
  const children = shadowRoot.querySelector('.children-wrap');

  if (children) {
    const childrenShadowRoots = getShadowRoots(children);
    childrenShadowRoots.forEach(shadowRoot => {
      if (shadowRoot) {
        clickRow(shadowRoot);
        const propertyList = getAttrPanelData();
        const attribute = shadowRoot.querySelector('.piece-name')?.innerHTML;
        const target = shadowRoot.querySelector('.layer-name')?.innerHTML;

        properties.push({
          target,
          attribute,
          property: propertyList?.map(analyzeProperty),
        });
      }
    });
  }

  const title = header?.querySelector('.piece-name')?.innerHTML;

  return { title, properties };
}

/** Main */
function analyzeTimeline() {
  console.log('ANALYZE START');
  const [, _, timelinePanel] = getShadowRoots();

  if (timelinePanel == null) {
    return;
  }
  const timelineShadowRoots = getShadowRoots(timelinePanel);
  const json = timelineShadowRoots.reduce((acc, cur) => {
    //NOTE: 바깥에서 null처리
    if (cur) {
      acc.push(analyzeRows(cur));
    }
    return acc;
  }, [] as any[]);

  console.log('ANALYZE END', json);
  return json;
}

window.onload = function () {
  chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
    if (request.action === 'ANALYZE') {
      const result = analyzeTimeline();
      sendResponse({ result });
      return;
    }
    sendResponse({ result: 'failure' });
  });
};
