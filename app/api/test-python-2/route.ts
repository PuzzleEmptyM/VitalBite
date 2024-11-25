// import { NextResponse } from "next/server";

// export const GET = async () => {
//   try {
//     // Predefined test data
//     const uid = 1;
//     const message = "This is a test message";

//     // Define the host URL (fallback to localhost for local testing)
//     const host = process.env.HOST || "http://localhost:3000";

//     // Call the existing test-python API endpoint
//     const response = await fetch(`${host}/api/test-python`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ uid, message }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to call test-python API: ${errorText}`);
//     }

//     const data = await response.json();

//     // Return the response as text to display in the browser
//     return new NextResponse(`
//       <html>
//       <body>
//         <h1>Python Script Response</h1>
//         <pre>${JSON.stringify(data, null, 2)}</pre>
//       </body>
//       </html>
//     `, {
//       headers: { "Content-Type": "text/html" },
//     });
//   } catch (error) {
//     console.error("Error in test-python-2 endpoint:", error);

//     return new NextResponse(`
//       <html>
//       <body>
//         <h1>Error</h1>
//         <p>${error.message}</p>
//       </body>
//       </html>
//     `, {
//       headers: { "Content-Type": "text/html" },
//     });
//   }
// };

import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const host = process.env.HOST || "http://localhost:3000";

    // Call the /api/test-python endpoint
    const response = await fetch(`${host}/api/test-python`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: 1,
        message: "This is a test message",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to call test-python API: ${error}`);
    }

    const data = await response.json();

    return new NextResponse(`
      <html>
      <body>
        <h1>Python Script Response</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return new NextResponse(`
      <html>
      <body>
        <h1>Error</h1>
        <p>${error.message}</p>
      </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" },
    });
  }
};
