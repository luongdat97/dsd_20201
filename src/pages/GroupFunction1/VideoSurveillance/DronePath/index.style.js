import styled from "styled-components";

const StyleVideoSurveillance = styled.div`
  .drone-icon:hover {
    font-size: 3em;
    background-color: #ffffff;
    border-radius: 20px;
    opacity: 0.5;
    color: #d8fffe !important;
  }
  .tree-icon:hover {
    font-size: 3em;
    background-color: #ffffff;
    border-radius: 20px;
    opacity: 0.5;
    color: #d8fffe !important;
  }
`;

export const droneHoverStyle = {
  fontSize: '3em',
  backgroundColor: '#ffffff',
  borderRadius: 30,
  opacity: 0.8,
  color: '#007BFF',
}
export const droneStyle = {
  fontSize: '3em',
  backgroundColor: 'transparent',
  borderRadius: 0,
  opacity: 1,
  color: '#1890FF',
}
export const treeHoverStyle = {
  fontSize: '3em',
  backgroundColor: '#ffffff',
  borderRadius: 30,
  opacity: 0.8,
  color: '#007BFF',
}
export const treeStyle = {
  fontSize: '3em',
  backgroundColor: 'transparent',
  borderRadius: 0,
  opacity: 1,
  color: '#52C41A',
}

export default StyleVideoSurveillance;
