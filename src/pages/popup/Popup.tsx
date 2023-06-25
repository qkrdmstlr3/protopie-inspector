import styled from '@emotion/styled';
import { useState } from 'react';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

export function Popup() {
  const [json, setJSON] = useState<any>();

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      if (currentTab && currentTab.id) {
        chrome.tabs.sendMessage(currentTab.id, { action: 'ANALYZE' }, response => {
          console.log('response', response.result);
          setJSON(response.result);
        });
      }
    });
  };

  return (
    <Container>
      <Button onClick={handleClick}>JSON으로 가져오기</Button>
      {json && (
        <JSONData>
          <JsonView data={json} shouldInitiallyExpand={() => true} style={defaultStyles} />
        </JSONData>
      )}
    </Container>
  );
}

const Button = styled.button`
  font-size: 16px;
  padding: 15px 28px;
  border-radius: 16px;
  outline: none;
  border: none;
  color: #fff;
  background-color: #3182f6;
  white-space: nowrap;
  transition: all 0.1s linear;

  &:active {
    outline: none;
    transform: scale(0.96);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const JSONData = styled.div`
  font-size: 15px;
`;
