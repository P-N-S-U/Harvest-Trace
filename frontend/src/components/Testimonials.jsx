import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      content: "Since joining HarvestTrace, I've found reliable customers who value my natural farming methods. The certification gives me recognition for my sustainable practices, and I'm earning 40% more than through traditional markets.",
      author: "Rajan Sharma",
      role: "Natural Farmer, Karnataka"
    },
    {
      content: "I've always wanted to support natural farmers but never knew how to verify claims. HarvestTrace's QR code system lets me see exactly where my food comes from and how it was grown. The direct connection with farmers makes me confident in my choices.",
      author: "Priya Malhotra",
      role: "Conscious Consumer, Mumbai"
    }
  ];

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4" style={{color:"#01c64b"}}>Stories from Our Community</h2>
      <div className="row">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="col-md-6 mb-4 d-flex">
            <div className="card h-100 w-100 d-flex flex-column">
              <div className="card-body d-flex flex-column">
                <p className="card-text flex-grow-1">{testimonial.content}</p>
                <h5 className="card-title mt-3">{testimonial.author}</h5>
                <p className="card-subtitle text-muted">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
