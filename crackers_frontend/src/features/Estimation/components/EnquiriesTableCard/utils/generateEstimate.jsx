import html2pdf from "html2pdf.js";

const orgNames = {
  "31e5d1baebb24c1": "Sri Srinivasa Crackers World",
  "5381dfd536ae0cb": "SREE HAYAGREEVA CRACKERS",
  "75f53b6dbb8215e": "Venkateswara Pyro Park",
};

function generateEstimateHTML(estimate) {
  const orgName = orgNames[estimate.organization_id] || "Unknown Organization";

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin-bottom: 10px; }
          .header { text-align: center; margin-bottom: 20px; }
          .footer { margin-top: 40px; font-size: 12px; text-align: center; }
          .row { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .col { width: 48%; }
          h3 { margin-bottom: 6px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 14px; }
          .summary { margin-top: 20px; }
          .summary p { margin: 4px 0; font-size: 14px; }
          .notes { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${orgName}</h1>
          <p><em>Official Estimate Document</em></p>
        </div>

        <h2>Estimate #${estimate.estimate_code}</h2>

        <div class="row">
          <div class="col">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${estimate.customer_name}</p>
            <p><strong>Email:</strong> ${estimate.email}</p>
            <p><strong>Phone:</strong> ${estimate.phone}</p>
            <p><strong>Address:</strong> ${estimate.address}, ${estimate.city}, ${estimate.state} - ${estimate.postal_code}</p>
          </div>

          <div class="col">
            <h3>Estimate Details</h3>
            <!-- <p><strong>Invoice ID:</strong> ${estimate.invoice_id}</p> -->
            <p><strong>Organization ID:</strong> ${estimate.organization_id}</p>
            <p><strong>Priority:</strong> ${estimate.priority}</p>
            <p><strong>Status:</strong> ${estimate.status}</p>
            <p><strong>Created At:</strong> ${estimate.createdAt}</p>
            <p><strong>Updated At:</strong> ${estimate.updatedAt}</p>
          </div>
        </div>

        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th><th>Quantity</th><th>Price</th><th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${estimate.items.map(
    (i) => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.quantity}</td>
                  <td>₹${parseFloat(i.price).toFixed(2)}</td>
                  <td>₹${parseFloat(i.subtotal).toFixed(2)}</td>
                </tr>
              `
  ).join("")}
          </tbody>
        </table>

        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Total Price:</strong> ₹${estimate.total_price}</p>
          <p><strong>Discount:</strong> ₹${estimate.discount}</p>
          <p><strong>Total Amount:</strong> ₹${estimate.total_amount}</p>
        </div>

        <div class="notes">
          <h3>Message</h3>
          <p>${estimate.message || "-"}</p>
        </div>

        <div class="footer">
          <p>Authorized Signature: ______________________</p>
          <p>${orgName} | Confidential</p>
        </div>
      </body>
    </html>
  `;
}

function printEstimate(estimate) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(generateEstimateHTML(estimate));
  printWindow.document.close();
  printWindow.print();
}

function downloadEstimate(estimate) {
  const container = document.createElement("div");
  container.innerHTML = generateEstimateHTML(estimate);

  const opt = {
    margin: 0.5,
    filename: `Estimate_${estimate.estimate_id}.pdf`,
    images: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(container).set(opt).save();
}

export { printEstimate, downloadEstimate, generateEstimateHTML }
