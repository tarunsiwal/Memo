// import React, { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";

// function HomePage() {
//   const [redirect, setRedirect] = useState(false);

//   useEffect(() => {
//     setTimeout(() => setRedirect(true), 0);
//   }, []);

//   if (redirect) {
//     return <Navigate to="/inbox" />;
//   }

//   return (
//     <div className='mainContainer gap-4 p-4' >
//         <h1>Welcome to Karyam</h1>
//     </div>
//   )
// }

// export default HomePage