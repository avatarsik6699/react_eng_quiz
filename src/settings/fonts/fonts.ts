import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import RobotoURLwoff from './Roboto/Roboto-Regular.woff';
export default createGlobalStyle`
${normalize}
@font-face {
    font-family: 'Roboto';
    src: url(${RobotoURLwoff}) format('woff');
    font-weight: ${400};
    font-style: normal;
  }
`;
