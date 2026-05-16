import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { TaskContext } from '../context/TaskContext';
import ReactMarkdown from 'react-markdown';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { getTaskById, updateTaskMarkdown, addToRecentlyOpened } = useContext(TaskContext);
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState('split');

  // 1. Initialize task data ONLY ONCE when opening the page
  useEffect(() => {
    if (!isInitialized) {
      const foundTask = getTaskById(id);
      if (foundTask) {
        setTask(foundTask);
        setMarkdown(foundTask.markdownContent || '');
        addToRecentlyOpened(foundTask);
        setIsInitialized(true);
      } else {
        navigate('/');
      }
    }
  }, [id, getTaskById, navigate, isInitialized, addToRecentlyOpened]);

  // 2. Auto-save with Debounce (Wait 1 second after typing stops before saving)
  useEffect(() => {
    if (isInitialized && task && markdown !== (task.markdownContent || '')) {
      const timer = setTimeout(() => {
        console.log("Debounce timer finished, saving markdown...");
        updateTaskMarkdown(id, markdown);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown]); // Only depend on markdown so it doesn't cancel when context updates

  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.title.replace(/\s+/g, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    // Force save immediately before going back if changed
    if (markdown !== (task.markdownContent || '')) {
      updateTaskMarkdown(id, markdown);
    }
    navigate(-1);
  };

  if (!task) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Container fluid className="min-vh-100 bg-body-tertiary py-4 px-4 text-body">
      <Button 
        variant="outline-secondary" 
        size="sm" 
        onClick={handleBack} 
        className="mb-4 rounded-pill px-4"
      >
        <i className="bi bi-arrow-left"></i> Back
      </Button>

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden mb-4 bg-body">
        <div style={{ height: '10px', backgroundColor: task.color }}></div>
        <Card.Body className="p-4 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-6 fw-bold m-0" style={{ color: task.color }}>{task.title}</h1>
            <p className="text-body-secondary mb-0 mt-2 fs-5">{task.description}</p>
          </div>
          <div className="bg-body-tertiary rounded-3 px-4 py-2 border shadow-sm text-center ms-4" style={{ minWidth: '120px', borderColor: 'var(--bs-border-color)' }}>
            <span className="d-block fs-5 fw-bold text-body">{months[task.month]} {task.day}</span>
            <span className="d-block text-muted small">{task.year}</span>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4 h-100">
        {/* Editor Column */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <Col md={viewMode === 'editor' ? 12 : 6}>
            <Card className="shadow-sm border-0 rounded-4 h-100 bg-body">
              <Card.Header className="bg-body border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-body-secondary mb-0"><i className="bi bi-markdown"></i> Markdown Editor</h5>
                <Button 
                  variant="link" 
                  className="text-secondary p-0 m-0" 
                  onClick={() => setViewMode(viewMode === 'split' ? 'editor' : 'split')}
                  title={viewMode === 'split' ? "Expand Editor" : "Collapse"}
                >
                  <i className={`bi ${viewMode === 'split' ? 'bi-arrows-angle-expand' : 'bi-arrows-angle-contract'} fs-5`}></i>
                </Button>
              </Card.Header>
              <Card.Body className="p-4">
                <Form.Control
                  as="textarea"
                  className="w-100 h-100 border-0 bg-body-tertiary p-3 text-body"
                  style={{ minHeight: '500px', resize: 'none' }}
                  placeholder="Start writing your markdown notes here..."
                  value={markdown}
                  onChange={handleMarkdownChange}
                  onBlur={() => updateTaskMarkdown(id, markdown)}
                />
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Preview Column */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <Col md={viewMode === 'preview' ? 12 : 6}>
            <Card className="shadow-sm border-0 rounded-4 h-100 bg-body">
              <Card.Header className="bg-body border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-body-secondary mb-0"><i className="bi bi-eye"></i> Live Preview</h5>
                <div>
                  {markdown && (
                    <Button 
                      variant="link" 
                      className="text-primary p-0 m-0 me-3" 
                      onClick={downloadMarkdown}
                      title="Download Markdown File"
                    >
                      <i className="bi bi-download fs-5"></i>
                    </Button>
                  )}
                  <Button 
                    variant="link" 
                    className="text-secondary p-0 m-0" 
                    onClick={() => setViewMode(viewMode === 'split' ? 'preview' : 'split')}
                    title={viewMode === 'split' ? "Expand Preview" : "Collapse"}
                  >
                    <i className={`bi ${viewMode === 'split' ? 'bi-arrows-angle-expand' : 'bi-arrows-angle-contract'} fs-5`}></i>
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-4 bg-body overflow-auto text-body" style={{ minHeight: '500px' }}>
                {markdown ? (
                  <div className="markdown-preview">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-muted h-100 d-flex justify-content-center align-items-center">
                    Preview will appear here
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default TaskDetailsPage;
