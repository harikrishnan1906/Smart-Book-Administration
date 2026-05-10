import { useEffect, useState } from "react";
import api from "../../../../services/api";
import "./SystemSettings.css";

const SystemSettings = () => {
  const [formData, setFormData] = useState({
    maxBooksPerStudent: "",
    finePerDay: "",
    returnPeriodStudent: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data) {
        setFormData({
          maxBooksPerStudent: res.data.maxBooksPerStudent || "",
          finePerDay: res.data.finePerDay || "",
          returnPeriodStudent: res.data.returnPeriodStudent || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', formData);
      alert("Settings saved successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading settings...</div>;
  }

  return (
    <>
      <h4 className="mb-4">System Settings</h4>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Max books per student
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="maxBooksPerStudent"
                  value={formData.maxBooksPerStudent}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Fine amount per day (₹)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="finePerDay"
                  value={formData.finePerDay}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Return period (days)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="returnPeriodStudent"
                  value={formData.returnPeriodStudent}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SystemSettings;
