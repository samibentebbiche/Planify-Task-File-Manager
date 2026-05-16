import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { TaskContext } from '../context/TaskContext';

const AddTaskPage = () => {
  const { addTask, currentYear } = useContext(TaskContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: location.state?.defaultYear ?? currentYear,
    month: location.state?.defaultMonth ?? new Date().getMonth(),
    day: new Date().getDate(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'title' || name === 'description' ? value : parseInt(value, 10)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(formData);
    navigate('/');
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-body-tertiary py-5 text-body">
      <Card className="shadow-lg border-0 rounded-4 w-100 bg-body" style={{ maxWidth: '600px' }}>
        <Card.Header className="bg-primary text-white text-center py-4 rounded-top-4 border-0">
          <h2 className="m-0 fw-bold">Add New Task</h2>
        </Card.Header>
        <Card.Body className="p-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-body-secondary">Task Title</Form.Label>
              <Form.Control 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title..." 
                required 
                className="p-3 bg-body-tertiary text-body border-secondary-subtle"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-body-secondary">Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description..." 
                required
                className="p-3 bg-body-tertiary text-body border-secondary-subtle"
              />
            </Form.Group>

            <div className="row mb-4">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-bold text-body-secondary">Year</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="p-3 bg-body-tertiary text-body border-secondary-subtle"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-bold text-body-secondary">Month</Form.Label>
                  <Form.Select 
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="p-3 bg-body-tertiary text-body border-secondary-subtle"
                  >
                    {months.map((m, idx) => (
                      <option key={idx} value={idx}>{m}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-bold text-body-secondary">Day</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="day"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={handleChange}
                    required
                    className="p-3 bg-body-tertiary text-body border-secondary-subtle"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-5">
              <Button variant="outline-secondary" size="lg" onClick={() => navigate('/')} className="px-5 rounded-pill">
                Cancel
              </Button>
              <Button variant="primary" type="submit" size="lg" className="px-5 rounded-pill fw-bold shadow-sm">
                Add Task
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddTaskPage;
