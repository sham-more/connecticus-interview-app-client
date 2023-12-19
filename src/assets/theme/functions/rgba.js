/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.connecticus-quiz-app.com/product/material-kit-react
 (https://www.connecticus-quiz-app.com)

Coded by www.connecticus-quiz-app.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/**
  The rgba() function helps you to create a rgba color code, it uses the hexToRgb() function
  to convert the hex code into rgb for using it inside the rgba color format.
 */

// Material Kit 2 React helper functions
import hexToRgb from "assets/theme/functions/hexToRgb";

function rgba(color, opacity) {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
