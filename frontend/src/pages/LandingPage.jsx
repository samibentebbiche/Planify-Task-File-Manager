import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { TaskContext } from '../context/TaskContext';

const LandingPage = () => {
  const { currentYear, setCurrentYear, getTasksForMonth, recentlyOpened, theme, toggleTheme, currentUser, friends } = useContext(TaskContext);
  const navigate = useNavigate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Container fluid className="min-vh-100 bg-body-tertiary p-0 d-flex position-relative text-body">
      
      {/* Sidebar for Recently Opened & Friends */}
      <div 
        className="bg-body border-end shadow-sm d-flex flex-column pt-4" 
        style={{ width: '280px', minHeight: '100vh', borderColor: 'var(--bs-border-color)' }}
      >
        <div className="flex-grow-1 d-flex flex-column">
          <h5 className="fw-bold px-4 mb-3 text-body-secondary d-flex align-items-center">
            <i className="bi bi-clock-history me-2"></i> Recent Tasks
          </h5>
          <div className="overflow-auto px-3 pb-2 flex-grow-1" style={{ maxHeight: '50vh' }}>
            {recentlyOpened.length === 0 ? (
              <p className="text-muted small px-2">No tasks opened recently.</p>
            ) : (
              <ListGroup variant="flush">
                {recentlyOpened.map(task => (
                  <ListGroup.Item 
                    key={task.id} 
                    action 
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="border-0 rounded-3 mb-2 shadow-sm d-flex align-items-center bg-body text-body"
                    style={{ borderLeft: `5px solid ${task.color} !important` }}
                  >
                    <div style={{ width: '6px', height: '100%', position: 'absolute', left: 0, top: 0, backgroundColor: task.color, borderRadius: '4px 0 0 4px' }}></div>
                    <div className="ms-2 text-truncate w-100">
                      <span className="fw-bold d-block text-truncate" style={{ fontSize: '0.9rem' }}>{task.title}</span>
                      <span className="text-muted small">{months[task.month]} {task.day}, {task.year}</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

          <hr className="mx-3 my-2" style={{ borderColor: 'var(--bs-border-color)' }} />

          {/* Friends Section Bottom Left */}
          <div className="px-3 pb-4">
            <h5 className="fw-bold px-2 mt-3 mb-3 text-body-secondary d-flex align-items-center">
              <i className="bi bi-people-fill me-2"></i> Friends
            </h5>
            <ListGroup variant="flush">
              {friends.map(friend => (
                <ListGroup.Item key={friend.id} className="border-0 bg-transparent px-2 py-2 d-flex align-items-center">
                  <div className="position-relative">
                    <img 
                      src={friend.avatar} 
                      alt={friend.username} 
                      className="rounded-circle border border-2 border-body bg-light"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                    />
                    <span 
                      className={`position-absolute bottom-0 end-0 p-1 border border-light rounded-circle ${friend.isOnline ? 'bg-success' : 'bg-secondary'}`}
                      style={{ width: '12px', height: '12px', transform: 'translate(25%, 25%)' }}
                    ></span>
                  </div>
                  <span className="ms-3 fw-semibold">{friend.username}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>

      {/* Main Content (Calendar) */}
      <div className="flex-grow-1 position-relative p-4">
        
        {/* User Profile Top Right */}
        <div className="position-absolute d-flex align-items-center" style={{ top: '20px', right: '30px', zIndex: 1000 }}>
          <span className="fw-bold me-3 fs-5">{currentUser.username}</span>
          <div className="position-relative">
            <img 
              src={currentUser.avatar} 
              alt="Current User" 
              className="rounded-circle shadow-sm border border-2 border-white bg-light" 
              style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
            />
            <span 
              className={`position-absolute bottom-0 end-0 p-1 border border-light rounded-circle ${currentUser.isOnline ? 'bg-success' : 'bg-secondary'}`}
              style={{ width: '14px', height: '14px', transform: 'translate(0%, 10%)' }}
            ></span>
          </div>
        </div>

        {/* Giant Plus Button Top Left of Main Content */}
        <div 
          className="position-absolute d-flex justify-content-center align-items-center rounded-circle bg-primary text-white shadow"
          style={{ width: '70px', height: '70px', top: '20px', left: '20px', cursor: 'pointer', zIndex: 1000 }}
          onClick={() => navigate('/add-task')}
        >
          <i className="bi bi-plus" style={{ fontSize: '3rem' }}></i>
        </div>

        {/* Theme Toggle Button Bottom Right */}
        <div 
          className="position-fixed d-flex justify-content-center align-items-center rounded-circle bg-secondary text-white shadow"
          style={{ width: '60px', height: '60px', bottom: '30px', right: '30px', cursor: 'pointer', zIndex: 1000 }}
          onClick={toggleTheme}
          title="Toggle Light/Dark Mode"
        >
          <i className={`bi ${theme === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'}`} style={{ fontSize: '1.8rem' }}></i>
        </div>

        <Container className="pt-5 mt-4">
          <div className="d-flex justify-content-center align-items-center mb-5">
            <button className="btn btn-outline-secondary me-3" onClick={() => setCurrentYear(y => y - 1)}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <h1 className="display-4 fw-bold text-body m-0">{currentYear}</h1>
            <button className="btn btn-outline-secondary ms-3" onClick={() => setCurrentYear(y => y + 1)}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          <Row className="g-4">
            {months.map((monthName, index) => {
              const monthIndex = index;
              const tasks = getTasksForMonth(currentYear, monthIndex);

              return (
                <Col xs={12} sm={6} md={4} lg={3} key={monthIndex}>
                  <div 
                    className="bg-body rounded-4 shadow-sm p-3 border h-100 d-flex flex-column"
                    style={{ minHeight: '200px', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' }, borderColor: 'var(--bs-border-color)' }}
                    onClick={() => navigate(`/month/${currentYear}/${monthIndex}`)}
                  >
                    <h4 className="fw-semibold mb-3 text-body-secondary border-bottom pb-2" style={{ borderColor: 'var(--bs-border-color) !important' }}>{monthName}</h4>
                    
                    <div className="flex-grow-1 overflow-hidden" style={{ maxHeight: '120px' }}>
                      {tasks.slice(0, 4).map(task => (
                        <div 
                          key={task.id}
                          className="rounded text-white small px-2 py-1 mb-2 text-truncate"
                          style={{ backgroundColor: task.color }}
                        >
                          {task.title}
                        </div>
                      ))}
                      {tasks.length > 4 && (
                        <div className="text-muted small fw-bold mt-1">
                          + {tasks.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>

    </Container>
  );
};

export default LandingPage;
