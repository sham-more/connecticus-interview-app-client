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

// Material Kit 2 React Base Styles
import borders from "assets/theme/base/borders";

// Material Kit 2 React Helper Functions
import pxToRem from "assets/theme/functions/pxToRem";

const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      borderRadius: borderRadius.xl,
      margin: `${pxToRem(16)} ${pxToRem(16)} 0`,
    },

    media: {
      width: "auto",
    },
  },
};
