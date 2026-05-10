import React from "react";
import "./SupportModal.css";

function SupportModal() {
  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");
  };

  return (
    <>
      {/* Support Modal */}
      <div
        className="modal fade"
        id="supportModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Report a Problem</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <form
                className="row g-3 needs-validation"
                noValidate
                onSubmit={handleSubmit}
              >
                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter your name.
                  </div>
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                   
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter a valid email.
                  </div>
                </div>

                {/* Issue Type */}
                <div className="col-md-12">
                  <label className="form-label">Issue Type</label>
                  <select className="form-select" required>
                    <option value="">-- Select Issue --</option>
                    <option>Login / Registration Issue</option>
                    <option>Page Not Loading</option>
                    <option>Form Submission Error</option>
                    <option>Broken Link</option>
                    <option>UI / Design Problem</option>
                    <option>Other</option>
                  </select>
                  <div className="invalid-feedback">
                    Please select an issue type.
                  </div>
                </div>

                {/* Message */}
                <div className="col-md-12">
                  <label className="form-label">Describe the Problem</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Explain the issue you are facing..."
                    required
                  ></textarea>
                  <div className="invalid-feedback">
                    Please describe your issue.
                  </div>
                </div>

                {/* Buttons */}
                <div className="col-12 text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Submit Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupportModal;
