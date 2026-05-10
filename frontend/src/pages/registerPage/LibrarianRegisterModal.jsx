import "./LibrarianRegisterModal.css";
import { useState } from "react";
import api from "../../services/api";

function LibrarianRegisterModal() {
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      const payload = {
        role: "librarian",
        fullName: form.fullName.value,
        staffId: form.staffId.value,
        mobile: form.mobile.value,
        email: form.email.value,
        departmentId: form.department.value,
        designation: form.librarianDesignation.value,
        // Files omitted for now unless using form data
      };
      
      const res = await api.post('/users/register', payload);
      setMessage({ type: 'success', text: res.data.message });
      form.reset();
      setValidated(false);
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Registration failed'
      });
    }
  };

  return (
    <div
      className="modal fade"
      id="librarianRegistrationModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content custom-librarian-register-modal">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa-solid fa-id-card"></i> Register as Librarian
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            {message && (
              <div className={`alert alert-${message.type} alert-dismissible`} role="alert">
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
              </div>
            )}
            <form
              noValidate
              className={`row g-3 ${validated ? "was-validated" : ""}`}
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Full Name"
                  required
                />
                <label htmlFor="fullName">Full Name</label>
                <div className="invalid-feedback">Please enter full name.</div>
              </div>

              {/* Staff ID */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="staffId"
                  placeholder="Staff ID"
                  required
                />
                <label htmlFor="staffId">Staff ID</label>
                <div className="invalid-feedback">Staff ID is required.</div>
              </div>

              {/* Mobile */}
              <div className="col-md-6 form-floating">
                <input
                  type="tel"
                  className="form-control"
                  id="mobile"
                  placeholder="Mobile Number"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  required
                />
                <label htmlFor="mobile">Mobile Number</label>
                <div className="invalid-feedback">
                  Enter a valid 10-digit mobile number.
                </div>
              </div>

              {/* Email */}
              <div className="col-md-6 form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email Address"
                  required
                />
                <label htmlFor="email">Email Address</label>
                <div className="invalid-feedback">
                  Enter a valid email address.
                </div>
              </div>

              {/* Department */}
              <div className="col-md-6">
                <label htmlFor="department" className="form-label fw-semibold">
                  Department
                </label>
                <select className="form-select" id="department" required>
                  <option value="">--Select Department--</option>
                  <option>English</option>
                  <option>Tamil</option>
                  <option>History</option>
                  <option>Economics</option>
                  <option>Political Science</option>
                  <option>Public Administration</option>
                  <option>Tourism and Travel Management</option>
                  <option>Defence</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Botany</option>
                  <option>Zoology</option>
                  <option>Statistics</option>
                  <option>Geology</option>
                  <option>Geography</option>
                  <option>Psychology</option>
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                </select>

                <div className="invalid-feedback">
                  Please select a department.
                </div>
              </div>

              {/* Designation */}
              <div className="col-md-6">
                <label
                  htmlFor="librarianDesignation"
                  className="form-label fw-semibold"
                >
                  Designation
                </label>
                <select
                  className="form-select"
                  id="librarianDesignation"
                  required
                >
                  <option value="">--Select Designation--</option>
                  <option>Professor</option>
                  <option>Assistant Professor</option>
                  <option>Associate Professor</option>
                  <option>Lab Assistant</option>
                  <option>Guest Lecturer</option>
                </select>

                <div className="invalid-feedback">
                  Please select a department.
                </div>
              </div>

              {/* Profile Picture */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  required
                />
                <div className="invalid-feedback">
                  Please upload a profile picture.
                </div>
              </div>

              {/* Upload ID proof */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Upload ID proof
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  required
                />
                <div className="invalid-feedback">
                  Please upload the ID proof.
                </div>
              </div>

              <hr />

              {/* Buttons */}
              <div className="col-12 mt-4 text-center ">
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Librarian
                </button>
              </div>

              {/* Login */}
              <div className="text-center mt-3">
                <p className="m-1">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="fw-semibold text-primary "
                    data-bs-toggle="modal"
                    data-bs-target="#librarianLoginModal"
                  >
                    Login here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibrarianRegisterModal;
