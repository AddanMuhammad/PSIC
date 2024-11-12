import React, { useState } from 'react';

function DetailForm() {
  const [formData, setFormData] = useState({
    serialNo: '',
    grwName: '',
    grwCode: '',
    fatherName: '',
    september: '',
    ratoon: '',
    february: '',
    total: '',
    phone: '',
    cnic: '',
    area: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};

    if (!formData.serialNo) errors.serialNo = 'Serial No is required';
    if (!formData.gnName) errors.gnName = 'GN Name is required';
    if (!formData.gnCode) errors.gnCode = 'GN Code is required';
    if (!formData.fatherName) errors.fatherName = 'Father Name is required';
    if (!formData.phone) {
      errors.phone = 'Phone Number is required';
    } else if (!/^\d{11}$/.test(formData.phone)) {
      errors.phone = 'Phone Number must be 11 digits';
    }
    if (!formData.cnic) {
      errors.cnic = 'CNIC is required';
    } else if (!/^\d{13}$/.test(formData.cnic)) {
      errors.cnic = 'CNIC must be 13 digits';
    }
    if (!formData.area) errors.area = 'Area is required';

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length === 0) {
      // If no errors, proceed with form submission logic
      console.log(formData);
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const fields = [
    { label: 'Serial No', name: 'serialNo' },
    { label: 'Grw. Code', name: 'grwCode' },
    { label: 'Grw. Name', name: 'grwName' },
    { label: 'Father Name', name: 'fatherName' },
    { label: 'September', name: 'september' },
    { label: 'Ratoon', name: 'ratoon' },
    { label: 'February', name: 'february' },
    { label: 'Total', name: 'total' },
    { label: 'Phone Number', name: 'phone' },
    { label: 'CNIC', name: 'cnic' },
    { label: 'Area', name: 'area' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Farmer Detail</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.gridContainer}>
          {fields.map((field) => (
            <div key={field.name} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={styles.input}
              />
              {formErrors[field.name] && (
                <span style={styles.error}>{formErrors[field.name]}</span>
              )}
            </div>
          ))}
        </div>
        <button type="submit" style={styles.button}>
          SAVE
        </button>
      </form>
    </div>
  );
};

const styles = {
  header: {
    fontSize: '24px',
    textAlign: 'left',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    width: '100%',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: '13px',
    color: '#333',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#00a881',
  },
  button: {
    marginTop: '30px',
    // background: 'linear-gradient(135deg, #a8e063, #56ab2f)', // Light green gradient
    background: 'linear-gradient(135deg, #005500, #007700)', // Dark green gradient 
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '20%',
    transition: 'background 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
  'input::placeholder': {
    fontSize: '12px',
    color: '#999',
  },
};
export default DetailForm