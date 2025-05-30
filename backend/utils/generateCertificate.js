const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateCertificate = async (farmer) => {
  return new Promise((resolve, reject) => {
    const certPath = path.join(__dirname, `../certificates/${farmer._id}.pdf`);
    
    // Create a new PDF document with A4 landscape orientation
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
      info: {
        Title: "Natural Farming Certificate",
        Author: "HarvestTrace",
        Subject: "Organic Farming Certification",
      }
    });
    
    const writeStream = fs.createWriteStream(certPath);
    doc.pipe(writeStream);
    
    // Get page dimensions
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const centerX = pageWidth / 2;
    
    // Add border design - with consistent margins
    const margin = 40;
    doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2))
       .lineWidth(3)
       .stroke("#2c5e1a");
       
    // Add inner border
    doc.rect(margin + 10, margin + 10, pageWidth - ((margin + 10) * 2), pageHeight - ((margin + 10) * 2))
       .lineWidth(1)
       .stroke("#2c5e1a");
    
    // Add background watermark
    doc.save(); // Save the current state
    doc.fontSize(100)
       .fillOpacity(0.04)
       .fillColor("#2c5e1a");
    
    // Calculate text width to center it properly
    const watermarkText = "HarvestTrace";
    const watermarkWidth = doc.widthOfString(watermarkText);
    doc.text(watermarkText, centerX - (watermarkWidth / 2), pageHeight / 2 - 50);
    
    doc.restore(); // Restore to previous state
    
    // Start positioning from the top with proper spacing
    let yPosition = 80;
    
    // Add logo (assuming you have a logo file)
    const logoPath = path.join(__dirname, "../assets/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, centerX - 50, yPosition, {width: 100});
      yPosition += 120;
    }
    
    // Certificate header - center text properly
    doc.fontSize(16)
       .fillColor("#2c5e1a");
    
    const headerText = "HARVESTRACE";
    const headerWidth = doc.widthOfString(headerText);
    doc.text(headerText, centerX - (headerWidth / 2), yPosition);
    yPosition += 25;
    
    doc.fontSize(12)
       .fillColor("#555");
    
    const subHeaderText = "NATURAL FARMING CERTIFICATION AUTHORITY";
    const subHeaderWidth = doc.widthOfString(subHeaderText);
    doc.text(subHeaderText, centerX - (subHeaderWidth / 2), yPosition);
    yPosition += 45;
    
    // Certificate Title
    doc.fontSize(28)
       .fillColor("#2c5e1a");
    
    const titleText = "Certificate of Natural Farming";
    const titleWidth = doc.widthOfString(titleText);
    doc.text(titleText, centerX - (titleWidth / 2), yPosition);
    yPosition += 50;
    
    // Certificate body
    doc.fontSize(14)
       .fillColor("#333");
    
    const introText = "This is to certify that";
    const introWidth = doc.widthOfString(introText);
    doc.text(introText, centerX - (introWidth / 2), yPosition);
    yPosition += 30;
    
    // Farmer Name
    doc.fontSize(24)
       .fillColor("#2c5e1a");
    
    const nameWidth = doc.widthOfString(farmer.name);
    doc.text(farmer.name, centerX - (nameWidth / 2), yPosition);
    yPosition += 35;
    
    // Farmer ID
    doc.fontSize(12)
       .fillColor("#555");
    
    const idText = `Farmer ID: ${farmer._id}`;
    const idWidth = doc.widthOfString(idText);
    doc.text(idText, centerX - (idWidth / 2), yPosition);
    yPosition += 30;
    
    // Certificate Text - wrapped properly to avoid overflow
    doc.fontSize(14)
       .fillColor("#333");
    
    const certText = "Has successfully met all the requirements and standards for Natural Farming practices as established by HarvestTrace and has been verified through our rigorous inspection and certification process.";
    
    // Calculate text height to ensure no overflow
    const textOptions = {
      width: 500,
      align: "center"
    };
    
    doc.text(certText, centerX - 250, yPosition, textOptions);
    
    // Calculate text height to add to yPosition
    const textHeight = doc.heightOfString(certText, textOptions);
    yPosition += textHeight + 40;
    
    // Certificate details section
    const certificationDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Center the details section
    const detailsY = yPosition;
    doc.fontSize(12)
       .fillColor("#333");
    
    const certDateText = `Certification Date: ${certificationDate}`;
    const certDateWidth = doc.widthOfString(certDateText);
    doc.text(certDateText, centerX - (certDateWidth / 2), detailsY);
    
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const validText = `Valid Until: ${formattedExpiryDate}`;
    const validWidth = doc.widthOfString(validText);
    doc.text(validText, centerX - (validWidth / 2), detailsY + 25);
    
    const certNumText = `Certificate Number: HT-${farmer._id.toString().substring(0, 8)}`;
    const certNumWidth = doc.widthOfString(certNumText);
    doc.text(certNumText, centerX - (certNumWidth / 2), detailsY + 50);
    
    // Signatures section
    const signaturesY = pageHeight - 140;
    const leftSignatureX = pageWidth / 3;
    const rightSignatureX = (pageWidth / 3) * 2;
    
    // Left signature (Admin signature with cursive text)
    doc.fontSize(10)
       .fillColor("#333");
    
    const leftSigText = "Admin Signature";
    const leftSigWidth = doc.widthOfString(leftSigText);
    doc.text(leftSigText, leftSignatureX - (leftSigWidth / 2), signaturesY);
    
    // Assuming admin's name is stored in admin.signatureName
   const adminSignatureName = "Batman" || "Administrator";

   // Load a cursive font for a signature-style appearance
   const cursiveFontPath = path.join(__dirname, "../assets/fonts/Bastliga One.ttf");
   if (fs.existsSync(cursiveFontPath)) {
      doc.font(cursiveFontPath);
   } else {
      doc.font('Helvetica-Oblique'); // Fallback to italicized font
   }

   // Render the administrator's signature
   doc.fontSize(50)
      .fillColor("#0000AA")
      .text(adminSignatureName, leftSignatureX - 50, signaturesY );

   // Optional: Underline the signature
   doc.moveTo(leftSignatureX - 55, signaturesY + 50)
      .lineTo(leftSignatureX + 55, signaturesY + 50)
      .stroke("#0000AA");
    
    doc.font('Helvetica')
       .fontSize(10)
       .fillColor("#333");
    
    const leftTitleText = "Administrator";
    const leftTitleWidth = doc.widthOfString(leftTitleText);
    doc.text(leftTitleText, leftSignatureX - (leftTitleWidth / 2), signaturesY + 60);
    
    const leftOrgText = "HarvestTrace";
    const leftOrgWidth = doc.widthOfString(leftOrgText);
    doc.text(leftOrgText, leftSignatureX - (leftOrgWidth / 2), signaturesY + 75);
    
    // Right signature (Stamp image)
    const rightSigText = "Official Stamp";
    const rightSigWidth = doc.widthOfString(rightSigText);
    doc.text(rightSigText, rightSignatureX - (rightSigWidth / 2), signaturesY);
    
    // Add stamp image from file
    const stampPath = path.join(__dirname, "../assets/stamp2.png");
    if (fs.existsSync(stampPath)) {
      // Load stamp with proper sizing and centered positioning
      doc.image(stampPath, rightSignatureX - 50, signaturesY +5, {
        width: 90,
        align: 'center'
      });
    } else {
      // Fallback if stamp image doesn't exist - draw a circular stamp
      doc.save();
      doc.translate(rightSignatureX, signaturesY + 40);
      doc.circle(0, 0, 40)
         .lineWidth(1)
         .dash(3, { space: 2 })
         .stroke("#2c5e1a");
      doc.fontSize(10)
         .fillColor("#2c5e1a")
         .text("HARVESTRACE", -30, -5, {align: "center"});
      doc.restore();
    }
    
    // Footer
    doc.fontSize(8)
       .fillColor("#888");
    
    const footerText = "This certificate is issued based on the inspection conducted by HarvestTrace and is subject to periodic verification.";
    const footerWidth = doc.widthOfString(footerText);
    doc.text(footerText, centerX - (footerWidth / 2), pageHeight - 50);
    
    doc.end();

    // Resolve the promise when writing is done
    writeStream.on("finish", () => resolve(`/certificates/${farmer._id}.pdf`));
    writeStream.on("error", (err) => reject(err));
  });
};

module.exports = generateCertificate;