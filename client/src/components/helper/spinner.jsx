import React from "react";
import { Oval } from "react-loader-spinner";

const Spinner = () => (
  <div
    className="spinner"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 6.5rem)",
    }}
  >
    <Oval
      height={30}
      width={30}
      color="rgb(255, 167, 59)"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="rgb(255, 167, 59)"
      strokeWidth={5}
      strokeWidthSecondary={2}
    />
  </div>
);

export default Spinner;
