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

// Material Kit 2 React base styles
import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";

const { borderRadius } = borders;
const { xxl } = boxShadows;

export default {
  styleOverrides: {
    paper: {
      borderRadius: borderRadius.lg,
      boxShadow: xxl,
    },

    paperFullScreen: {
      borderRadius: 0,
    },
  },
};
