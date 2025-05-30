import React from 'react';

const FeatureCards = () => {
  const features = [
    {
      title: "Verified Natural Farming",
      description: "Our rigorous certification process ensures all products meet authentic natural farming standards, giving farmers recognition for their sustainable practices.",
      icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01"
    },
    {
      title: "Complete Traceability",
      description: "Scan our QR codes to instantly view detailed information about your food's origin, farming methods, harvest date, and journey from farm to table.",
      icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z M12 12 12 12z"
    },
    {
      title: "Direct Fair Market",
      description: "Connect directly with farmers to purchase high-quality natural products at fair prices, eliminating unnecessary intermediaries and supporting sustainable livelihoods.",
      icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"
    }
  ];

  return (
    <section className="container my-5">
      <div className="row">
        {features.map((feature, index) => (
          <div key={index} className="col-md-4 mb-4 d-flex">
            <div className="card text-center h-100 w-100 d-flex flex-column">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title" style={{color:"#23B714"}}>{feature.title}</h5>
                <p className="card-text flex-grow-1">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
