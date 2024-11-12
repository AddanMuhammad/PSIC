import React, { useState, useEffect } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined,  EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Input } from 'antd';
import Pagination from './Pagination';
import { toast } from 'react-toastify';
import { newJSON } from '../json/Json';
import { NavLink } from 'react-router-dom';

const initialData = newJSON.features
  .map((feature, index) => {
    const { properties } = feature;
    return {
      id: index + 1,
      grw_code: properties.Grw__Code,
      grw_name: properties.Grw__Name,
      father_name: properties.Father_Nam,
      september: properties.September,
      ratoon: properties.Ratoon,
      february: properties.February,
      total: properties.Total,
      phone: properties.Phone_no,
      cnic: properties.CNIC,
      area: properties.Area
    };
  })
  .filter((item) => item.grw_code !== null);



const headers = [
  { label: "Sr.", key: "sr" },
  { label: "Grower code", key: "grw_code" },
  { label: "Grower name", key: "grw_name" },
  { label: "Father name", key: "father_name" },
  { label: "September", key: "september" },
  { label: "Ratoon", key: "ratoon" },
  { label: "February", key: "february" },
  { label: "Total", key: "total" },
  { label: "Phone", key: "phone" },
  { label: "CNIC", key: "cnic" },
  { label: "Area", key: "area" },
  { label: "Actions", key: "actions" }
];



function TableComponent() {
  const [data, setData] = useState(initialData);
  const [currentData, setCurrentData] = useState(initialData.slice(0, 7));
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});


  

  const itemsPerPage = 7;

  useEffect(() => {
    const filteredData = data.filter(item => {
      return Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(search.toLowerCase())
      );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentData(filteredData.slice(startIndex, endIndex));
  }, [data, currentPage, search]);

  const handlePageChange = (startIndex, endIndex, pageNumber) => {
    const slicedData = data.slice(startIndex, endIndex);
    setCurrentData(slicedData);
    setCurrentPage(pageNumber);
  };

  const showModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // Validation checks before saving
    const errors = {};

    // Check if required fields are filled
    if (!String(selectedRow.grw_name).trim()) {
      errors.grw_name = "Grower Name is required.";
    }

    if (!String(selectedRow.father_name).trim()) {
      errors.father_name = "Father Name is required.";
    }

    if (!String(selectedRow.september).trim() || isNaN(selectedRow.september)) {
      errors.september = "September field must be a valid number.";
    }

    if (!String(selectedRow.ratoon).trim() || isNaN(selectedRow.ratoon)) {
      errors.ratoon = "Ratoon field must be a valid number.";
    }

    if (!String(selectedRow.february).trim() || isNaN(selectedRow.february)) {
      errors.february = "February field must be a valid number.";
    }

    if (!String(selectedRow.total).trim() || isNaN(selectedRow.total)) {
      errors.total = "Total field must be a valid number.";
    }

    // Update phone number validation
    const phonePattern = /^(\+92|92|0)?[0-9]{10}$/; // Allowing for formats with +92, 92, or 0 followed by 10 digits
    if (!phonePattern.test(String(selectedRow.phone))) {
      errors.phone = "Phone number must be 11 digits (including the country code).";
    }

    const cnicPattern = /^[0-9]{13}$/;
    if (!cnicPattern.test(String(selectedRow.cnic))) {
      errors.cnic = "CNIC must be 13 digits.";
    }

    if (!String(selectedRow.area).trim()) {
      errors.area = "Area is required.";
    }

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Set validation errors to state
      return; // Stop saving the data if validation fails
    }

    // Proceed with saving if no errors
    const originalData = data.find((item) => item.id === selectedRow.id);
    const isUpdated = JSON.stringify(originalData) !== JSON.stringify(selectedRow);

    if (isUpdated) {
      const updatedData = data.map((item) =>
        item.id === selectedRow.id ? selectedRow : item
      );
      setData(updatedData);

      // Update the current page data to reflect the updated state
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCurrentData(updatedData.slice(startIndex, endIndex));

      toast.success('Record updated successfully!');
    }

    setIsModalOpen(false);
    setSelectedRow(null);
    setValidationErrors({}); // Clear validation errors after successful update
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRow((prev) => ({
      ...prev,
      [name]: value, // Ensure the correct field is being updated
    }));
    console.log(selectedRow); // Add this to confirm the updated state
  };

  const showDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedData = data.filter(item => item.id !== deleteId);
    setData(updatedData);
    setIsDeleteModalOpen(false);
    toast.error('Record deleted successfully!');
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setData(sortedData);
    // Recalculate the current page data to reflect sorting
    handlePageChange(0, 5, 1);
  };

  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((row) => Object.values(row).map((value) => `"${value}"`).join(","))
      .join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "customer_orders.csv";
    link.click();
  };

  return (
    <div>
      <main className="table">
        <section className="table__header">
          <h1>Grower Information</h1>
          <div className="input-group">
            <input
              type="search"
              placeholder="Search Data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span>
              <SearchOutlined style={{ fontSize: '24px' }} />
            </span>
          </div>
          <div className="export__file">
            <Button style={{
              background: 'linear-gradient(135deg, #a8e063, #56ab2f)',

              color: 'white',
            }} type="primary" shape="round" icon={<DownloadOutlined />} onClick={exportToCSV}>
              Download
            </Button>
          </div>
          <NavLink to="/create">
          <div className="export__file">
            <Button style={{
              background: 'rgb(51, 139, 147)',

              color: 'white',
            }} type="primary" shape="round" icon={<EditOutlined />} >
              Create
            </Button>
          </div>
          </NavLink>
          
        </section>

        <section className="table__body">
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    onClick={() => sortTable(header.key)}
                    className={header.key === 'actions' ? 'sticky-action' : ''}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr key={row.id}> {/* Make sure each row has a unique key */}
                  {headers.map((header) =>
                    header.key === "sr" ? (
                      <td key={header.key}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                    ) : header.key !== "actions" ? (
                      <td key={header.key}>{row[header.key]}</td>
                    ) : (
                      <td key={header.key} className="sticky-action">
                        {/* <button className="action-btn view-btn"><EyeOutlined /></button> */}
                        <button className="action-btn edit-btn" onClick={() => showModal(row)}><EditOutlined /></button>
                        <button className="action-btn delete-btn" onClick={() => showDeleteModal(row.id)}><DeleteOutlined /></button>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>


        {/* Modal for editing */}
        {selectedRow && (
          <Modal
            title="Edit Grower Info"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
             okText="OK"
          cancelText="Cancel"
            centered
            okButtonProps={{ style: { backgroundColor: 'green', borderColor: 'green' } }}
          >
            <div className="modal-content">
              {/* First row of fields */}
              <div className="input-group">
                <div className="input-wrapper">
                  <label>Grower Name</label>
                  <Input
                    name="grw_name"
                    value={selectedRow.grw_name}
                    onChange={handleInputChange}
                    placeholder="Grower Name"
                  />
                  {validationErrors.grw_name && (
                    <div className="error-message">{validationErrors.grw_name}</div>
                  )}
                </div>
                <div className="input-wrapper">
                  <label>Father Name</label>
                  <Input
                    name="father_name"
                    value={selectedRow.father_name}
                    onChange={handleInputChange}
                    placeholder="Father Name"
                  />
                  {validationErrors.father_name && (
                    <div className="error-message">{validationErrors.father_name}</div>
                  )}
                </div>
              </div>

              {/* Second row of fields */}
              <div className="input-group">
                <div className="input-wrapper">
                  <label>September</label>
                  <Input
                    name="september"
                    value={selectedRow.september}
                    onChange={handleInputChange}
                    placeholder="September"
                  />
                  {validationErrors.september && (
                    <div className="error-message">{validationErrors.september}</div>
                  )}
                </div>
                <div className="input-wrapper">
                  <label>Ratoon</label>
                  <Input
                    name="ratoon"
                    value={selectedRow.ratoon}
                    onChange={handleInputChange}
                    placeholder="Ratoon"
                  />
                  {validationErrors.ratoon && (
                    <div className="error-message">{validationErrors.ratoon}</div>
                  )}
                </div>
              </div>

              {/* Third row of fields */}
              <div className="input-group">
                <div className="input-wrapper">
                  <label>February</label>
                  <Input
                    name="february"
                    value={selectedRow.february}
                    onChange={handleInputChange}
                    placeholder="February"
                  />
                  {validationErrors.february && (
                    <div className="error-message">{validationErrors.february}</div>
                  )}
                </div>
                <div className="input-wrapper">
                  <label>Total</label>
                  <Input
                    name="total"
                    value={selectedRow.total}
                    onChange={handleInputChange}
                    placeholder="Total"
                  />
                  {validationErrors.total && (
                    <div className="error-message">{validationErrors.total}</div>
                  )}
                </div>
              </div>

              {/* Fourth row of fields */}
              <div className="input-group">
                <div className="input-wrapper">
                  <label>Phone Number</label>
                  <Input
                    name="phone"
                    value={selectedRow.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                  {validationErrors.phone && (
                    <div className="error-message">{validationErrors.phone}</div>
                  )}
                </div>
                <div className="input-wrapper">
                  <label>CNIC</label>
                  <Input
                    name="cnic"
                    value={selectedRow.cnic}
                    onChange={handleInputChange}
                    placeholder="CNIC"
                  />
                  {validationErrors.cnic && (
                    <div className="error-message">{validationErrors.cnic}</div>
                  )}
                </div>
              </div>

              {/* Fifth row of fields */}
              <div className="input-group">
                <div className="input-wrapper">
                  <label>Area</label>
                  <Input
                    name="area"
                    value={selectedRow.area}
                    onChange={handleInputChange}
                    placeholder="Area"
                  />
                  {validationErrors.area && (
                    <div className="error-message">{validationErrors.area}</div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete confirmation modal */}
        <Modal
          title="Are you sure?"
          open={isDeleteModalOpen}
          onOk={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          okText="Yes"
          cancelText="No"
          centered
          okButtonProps={{ style: { backgroundColor: 'red', borderColor: 'red' } }}
        >
          <p>Do you really want to delete this record?</p>
        </Modal>
      </main>

      <Pagination array={data} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
    </div>
  );
}

export default TableComponent;