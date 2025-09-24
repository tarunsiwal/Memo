import React from "react";
import Spinner from 'react-bootstrap/Spinner';

const SpinnerContainer = () => (
  <div
    className="spinner"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 15rem)",
    }}
  >
    {/* <Oval
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
    /> */}

    <Spinner animation="border" role="status" variant="warning">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default SpinnerContainer;
