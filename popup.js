const API_KEY = ""; // Add your Hunter.io API key here

document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.getElementById("result");

  if (!API_KEY) {
    resultDiv.innerHTML = `<p style="color:black; text-align:center;">Please add your Hunter.io API key in popup.js</p>`;
    return;
  }

  resultDiv.innerText = "Loading...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const handle = pathSegments[1]; // LinkedIn handle from URL
    //console.log("LinkedIn Handle:", handle);
    const enrichUrl = `https://api.hunter.io/v2/people/find?linkedin_handle=${handle}&api_key=${API_KEY}`;

    fetch(enrichUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.name && data.data.email) {
          const { fullName, email } = data.data.name
            ? { fullName: data.data.name.fullName, email: data.data.email }
            : { fullName: "Not found", email: "Not found" };

          const organization = data.data.employment?.name || "Not found";
          const designation = data.data.employment?.title || "Not found";

          resultDiv.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div><b>Full Name:</b> ${fullName}</div>
              <div><b>Email:</b> ${email}</div>
              <div><b>Organisation:</b> ${organization}</div>
              <div><b>Designation:</b> ${designation}</div>
            </div>
          `;
        } else {
          resultDiv.innerHTML = `<p style="color:#6b7280; text-align:center; font-style:italic;">No data found</p>`;
        }
      })
      .catch(() => {
        resultDiv.innerHTML = `<p style="color:#6b7280; text-align:center; font-style:italic;">No data found</p>`;
      });
  });
});
