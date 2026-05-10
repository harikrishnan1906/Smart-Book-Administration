import React from "react";
import "./StudentRegisterModal.css";
import { useState } from "react";
import api from "../../services/api";

function StudentRegisterModal() {
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState(null); const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      const payload = {
        role: "student",
        fullName: form.studentName.value,
        registerNumber: form.registerNumber.value,
        mobile: form.stdMobile.value,
        email: form.email.value,
        course: form.program.value,
        membershipType: form.membership.value,
        departmentId: "N/A" // Students don't have department in this form directly, maybe derived from course
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
      id="studentRegistrationModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content custom-student-register-modal">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa-solid fa-id-card"></i> Student Registration
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {message && (
              <div className={`alert alert-${message.type} alert-dismissible`} role="alert">
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
              </div>
            )}
            <form
              className={`row g-3 ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              {/* Student Name */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="studentName"
                  placeholder="Student Name"
                  required
                />
                <label htmlFor="studentName">Student Name</label>
                <div className="invalid-feedback">
                  Please enter student name.
                </div>
              </div>

              {/* Register Number */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="registerNumber"
                  placeholder="Register Number"
                  required
                />
                <label htmlFor="registerNumber">Register Number</label>
                <div className="invalid-feedback">
                  Register number is required.
                </div>
              </div>



              {/* Email */}
              <div className="col-md-6 form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  required
                />
                <label htmlFor="email">Email</label>
                <div className="invalid-feedback">
                  Enter a valid email address.
                </div>
              </div>

              {/* Mobile Number */}
              <div className="col-md-6 form-floating">
                <input
                  type="tel"
                  className="form-control"
                  id="stdMobile"
                  placeholder="Mobile Number"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  required
                />
                <label htmlFor="stdMobile">Mobile Number</label>
                <div className="invalid-feedback">
                  Enter a valid 10-digit mobile number.
                </div>
              </div>



              {/* Academic Program */}
              <div className="col-md-6">
                <label htmlFor="program" className="form-label fw-semibold">
                  Academic Program / Course
                </label>
                <select className="form-select" id="program" required>
                  <option value="">--Select course--</option>
                  <option>B.A.</option>
                  <option>B.Sc</option>
                  <option>B.Com</option>
                  <option>M.A.</option>
                  <option>M.Sc</option>
                  <option>M.Ss</option>
                  <option>M.Com</option>
                  <option>B.Ed</option>
                  <option>M.Ed</option>
                  <option>PHD</option>
                </select>

                <div className="invalid-feedback">Please select a program.</div>
              </div>

              {/* Membership Type */}
              <div className="col-md-6">
                <label htmlFor="membership" className="form-label fw-semibold">
                  Library Membership Type
                </label>
                <select className="form-select" id="membership" required>
                  <option value="">--Select membership--</option>
                  <option>Regular</option>
                  <option>Reference Only</option>
                  <option>Research</option>
                </select>

                <div className="invalid-feedback">Select membership type.</div>
              </div>




              {/* Profile Picture */}
              <div className="col-12">
                <label className="form-label">Profile Picture</label>
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

              <hr />

              {/* Submit */}
              <div className="col-12 text-center mt-3">
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary ">
                  Register
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
                    data-bs-target="#studentLoginModal"
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

export default StudentRegisterModal;
