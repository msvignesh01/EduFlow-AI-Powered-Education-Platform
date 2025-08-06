import React from 'react';

export const SimpleDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        EduFlow Dashboard
      </h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3>Study Hours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>42.5</p>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3>Courses</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>7</p>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3>Streak</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>12 days</p>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3>Points</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>1,240</p>
        </div>
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Welcome to EduFlow!</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Your AI-powered educational platform is now running successfully. 
          This is a simplified dashboard to verify the application is working correctly.
        </p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Quick Actions:</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Start Learning
            </button>
            <button style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              AI Chat
            </button>
            <button style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Study Materials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
