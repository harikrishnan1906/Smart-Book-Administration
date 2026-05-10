import "./StaffRegisterModal.css";
import { useState } from "react";
import api from "../../services/api";

function StaffRegisterModal() {
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
        role: "staff",
        fullName: form.staffFullName.value,
        staffId: form.staffId.value,
        mobile: form.staffMobile.value,
        email: form.staffEmail.value,
        departmentId: form.staffDepartment.value,
        designation: form.staffDesignation.value,
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
      id="staffRegistrationModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content custom-staff-register-modal">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa-solid fa-user-tie me-2"></i>
              Register as Staff
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          {/* Modal Body */}
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
                  id="staffFullName"
                  placeholder="Full Name"
                  required
                />
                <label htmlFor="staffFullName">Full Name</label>
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

              {/* Email */}
              <div className="col-md-6 form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="staffEmail"
                  placeholder="Email Address"
                  required
                />
                <label htmlFor="staffEmail">Email Address</label>
                <div className="invalid-feedback">
                  Enter a valid email address.
                </div>
              </div>

              {/* Mobile Number */}
              <div className="col-md-6 form-floating">
                <input
                  type="tel"
                  className="form-control"
                  id="staffMobile"
                  placeholder="Mobile Number"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  required
                />
                <label htmlFor="staffMobile">Mobile Number</label>
                <div className="invalid-feedback">
                  Enter a valid 10-digit mobile number.
                </div>
              </div>

              {/* Department */}
              <div className="col-md-6">
                <label
                  htmlFor="staffDepartment"
                  className="form-label fw-semibold"
                >
                  Department
                </label>
                <select className="form-select" id="staffDepartment" required>
                  <option value="">--Select Department--</option>
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
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
                  htmlFor="staffDesignation"
                  className="form-label fw-semibold"
                >
                  Designation
                </label>
                <select className="form-select" id="staffDesignation" required>
                  <option value="">--Select Designation--</option>
                  <option>Professor</option>
                  <option>Assistant Professor</option>
                  <option>Associate Professor</option>
                  <option>Lab Assistant</option>
                  <option>Guest Lecturer</option>
                </select>
                <div className="invalid-feedback">
                  Please select designation.
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

              {/* ID Proof */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Upload ID Proof
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  required
                />
                <div className="invalid-feedback">Please upload ID proof.</div>
              </div>

              <hr className="mt-4" />

              {/* Buttons */}
              <div className="col-12 mt-3 text-center">
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Staff
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-3">
                <p className="m-1">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="fw-semibold text-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#staffLoginModal"
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

export default StaffRegisterModal;
