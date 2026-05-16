import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { TaskContext } from '../context/TaskContext';

const MonthPage = () => {
  const { year, month } = useParams();
  const { getTasksForMonth, friends } = useContext(TaskContext);
  const navigate = useNavigate();
  
  const parsedYear = parseInt(year, 10);
  const parsedMonth = parseInt(month, 10);
  
  const tasks = getTasksForMonth(parsedYear, parsedMonth);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleShareClick = (e, taskTitle) => {
    e.stopPropagation(); // prevent card click
  };

  return (
    <Container fluid className="min-vh-100 bg-body-tertiary p-4 text-body">
      <div className="d-flex align-items-center mb-5 mt-3">
        <button className="btn btn-outline-secondary me-4 rounded-circle" style={{width: '50px', height: '50px'}} onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left fs-4"></i>
        </button>
        <h1 className="display-5 fw-bold m-0 text-body">{months[parsedMonth]} {parsedYear} Tasks</h1>
      </div>

      <Container>
        <Row className="g-4">
          {tasks.map(task => (
            <Col xs={12} sm={6} md={4} lg={3} key={task.id}>
              <Card 
                className="h-100 text-white shadow-sm border-0 rounded-4 position-relative"
                style={{ backgroundColor: task.color, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-white text-dark rounded-pill px-3 py-2 mt-1">
                      Day {task.day}
                    </span>
                    
                    {/* Share Dropdown */}
                    <Dropdown onClick={handleShareClick}>
                      <Dropdown.Toggle variant="link" className="text-white p-0 m-0 shadow-none border-0 d-flex align-items-center" style={{ textDecoration: 'none' }} id={`dropdown-share-${task.id}`}>
                        <div className="rounded-circle bg-white bg-opacity-25 d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px', transition: 'background-color 0.2s' }}>
                          <i className="bi bi-share-fill"></i>
                        </div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="shadow-lg border-0 rounded-3 p-2 bg-body text-body" style={{ minWidth: '220px' }}>
                        <Dropdown.Header className="fw-bold text-body-secondary pb-2">Share with friend</Dropdown.Header>
                        {friends.map(friend => (
                          <Dropdown.Item key={friend.id} href="#" className="d-flex align-items-center py-2 rounded-2" onClick={(e) => { e.preventDefault(); alert(`Shared ${task.title} with ${friend.username}! (Simulated)`); }}>
                            <div className="position-relative me-3">
                              <img 
                                src={friend.avatar} 
                                alt={friend.username} 
                                className="rounded-circle border border-2 border-body bg-light"
                                style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                              />
                              <span 
                                className={`position-absolute bottom-0 end-0 p-1 border border-light rounded-circle ${friend.isOnline ? 'bg-success' : 'bg-secondary'}`}
                                style={{ width: '10px', height: '10px', transform: 'translate(25%, 25%)' }}
                              ></span>
                            </div>
                            <span className="fw-medium text-body">{friend.username}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>
                  <Card.Title className="fw-bold fs-4 mb-3 pe-4">{task.title}</Card.Title>
                  <Card.Text className="text-white-50 mt-auto text-truncate">
                    {task.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
          
          {/* Add Task Card */}
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card 
              className="h-100 bg-body shadow-sm border-2 rounded-4"
              style={{ borderStyle: 'dashed', borderColor: 'var(--bs-border-color)', cursor: 'pointer', minHeight: '220px' }}
              onClick={() => navigate('/add-task', { state: { defaultYear: parsedYear, defaultMonth: parsedMonth } })}
            >
              <Card.Body className="d-flex flex-column justify-content-center align-items-center text-body-secondary">
                <i className="bi bi-plus-circle" style={{ fontSize: '4rem', color: 'var(--bs-secondary-color)' }}></i>
                <h5 className="mt-3 fw-bold text-muted">Add Task</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default MonthPage;
