import { Global } from "@emotion/react";

function Fonts() {
  return (
    <Global
      styles={`
              @font-face {
                  font-family: "Inter-SemiBold";
                  src: url('fonts/static/Inter-SemiBold.ttf') format("truetype");
              } 

            @font-face {
                  font-family: "Inter-Regular";
                  src: url('fonts/static/Inter-Regular.ttf') format("truetype");
              } 
        `}
    />
  );
}

export default Fonts;
